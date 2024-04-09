import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const cookiesList = cookies();
        const isBasketNull = cookiesList.has("basket-quick-shop");

        if (!isBasketNull) {
            return NextResponse.json({
                success: false,
                message: "Вы не можете оформить пустой заказ!",
            });
        } else {
            //Получаем токен
            const token = cookiesList.get("basket-quick-shop");

            const getToken = await db.basketToken.findFirst({
                where: {
                    token: token?.value,
                },
            });
        
            const cityUser = await db.user.findUnique({
                where: {
                    id: session.user.id
                },
                include: {
                    city: true
                }
            })

            const basket = await db.basket.findMany({
                where: {
                    id_token: getToken?.id,
                },
                include: {
                    product: {
                      include: {
                        user: {
                            include: {
                                cityWay: {
                                    include: {
                                        city1: true,
                                        city2: true,
                                        cityWayTransport: true
                                    }
                                },
                                sellerSity: {
                                    include: {
                                        city: true
                                    }
                                }
                            }
                        },
                        sellerCityProducts: {
                            include: {
                                sellerCity: {
                                    include: {
                                        city: true
                                    }
                                }
                            }
                        }
                      }  
                    },
                },
            });

            let result = [];

            //Бежим по всей корзине (по товарам)
            for(let i = 0; i < basket.length; i++){

                //Те склады, с которых хватает товаров для отправки до пользователя
                let sellerCityProductFit = []
                let isDeliveryProduct = false;

                //Бежим по складам товара из корзины
                for(let m = 0; m < basket[i].product.sellerCityProducts.length; m++){
                    //Проверяем на каких складах хватает товаров
                    if(basket[i].quantity <= basket[i].product.sellerCityProducts[m].count!){
                        sellerCityProductFit.push(basket[i].product.sellerCityProducts[m]);
                    }
                }

                //Проверяем, доставляет ли магазин в город, который выбран у пользователя
                for(let j = 0; j < basket[i].product.user.cityWay.length; j++){
                    if(basket[i].product.user.cityWay[j].idCity1 == cityUser?.city.id || basket[i].product.user.cityWay[j].idCity2 == cityUser?.city.id){
                        isDeliveryProduct = true;
                    }
                }

                if(isDeliveryProduct){
                    //объект графа
                    let graph: any = {}

                    //Получаем все вершины продавца
                    const topCityUser = basket[i].product.user.sellerSity.reduce((o: any, i: any) => {
                        if (!o.find((v: { idCity: any; }) => v.idCity == i.idCity)) {
                          o.push(i);
                        }
                        return o;
                    }, []);


                    //Добавлем вершины в граф
                    for(let q = 0; q < topCityUser.length; q++){
                        graph[topCityUser[q].city.name] = {}
                    }

                    //Связи в граф
                    for(let w = 0; w < basket[i].product.user.cityWay.length; w++){
                        //Наименьшее количество времени между городами
                        let masCost: any = [];
                        for(let o = 0; o < basket[i].product.user.cityWay[w].cityWayTransport.length; o++){
                            masCost[o] = basket[i].product.user.cityWay[w].cityWayTransport[o].cost
                        }

                        if(masCost.length > 0){
                            graph[basket[i].product.user.cityWay[w].city1.name][basket[i].product.user.cityWay[w].city2.name] = Math.min(masCost);
                            graph[basket[i].product.user.cityWay[w].city2.name][basket[i].product.user.cityWay[w].city1.name] = Math.min(masCost);
                        }
                    }
                    //Маршруты от пользователя до магазина
                    let path:any = []
                    //Индекс самого наименьшего маршрута в массиве path
                    let indexMinPath = -1;
                    //Минимальная дистанция в массиве path
                    let distancesMin = Number.MAX_SAFE_INTEGER;

                    //Находим все кротчайшие маршруты до всех складов
                    for(let e = 0; e < sellerCityProductFit.length; e++){
                        let tempDistance = 0;
                        let tempPath = shortPathWithDistances(graph, sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);
                        path.push(tempPath)
                        for(let q = 0; q < tempPath.length; q++){
                            tempDistance = tempDistance + Number(Object.values(tempPath[q])[0]);
                        }
                        
                        if(tempDistance < distancesMin){
                            distancesMin = tempDistance;
                            indexMinPath = e;
                        }
                    }

                    result[i] = {
                        id_product: basket[i].id_product,
                        id_basket: basket[i].id,
                        path: path[indexMinPath],
                        min_cost_path: distancesMin,
                        quantity: basket[i].quantity,
                        count_warehouse: sellerCityProductFit[indexMinPath].count
                    }

                    //graph, topCityUser, sellerCityProductFit, basket
                }else{
                    return NextResponse.json({ success: true, message: "Маршрут не построен! Данный товар не доставляется в ваш город.", sellerCityProductFit, basket });
                }
            }

            return NextResponse.json({ success: true, message: "Самый дешёвый маршрут построен!", result });


        }
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
function shortPathWithDistances(graph:any, start:any, end:any) {
    const distances:any = {}
    const visited = new Set()
    const path:any = {}
  
    for (const key in graph) {
      if (key !== start) {
        distances[key] = Infinity
      } else {
        distances[start] = 0
      }
    }
  
    while (!visited.has(end)) {
      let lowestDistance = Infinity
      let node:any = null
  
      for (const key in distances) {
        if (lowestDistance > distances[key] && !visited.has(key)) {
          lowestDistance = distances[key]
          node = key
        }
      }
  
      const neighbors = graph[node]
      for (const key in neighbors) {
        const newDistance = distances[node] + neighbors[key]
        if (newDistance < distances[key]) {
          distances[key] = newDistance
          path[key] = node
        }
      }
  
      visited.add(node)
    }
  
    const shortPath = []
    let current = end
    while (current !== start) {
      const currentWithDistance = { [current]: distances[current] }
      shortPath.unshift(currentWithDistance)
      current = path[current]
    }
    shortPath.unshift({ [start]: 0 })
  
    return shortPath
}