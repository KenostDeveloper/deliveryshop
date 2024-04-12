import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const data = await req.json();

        if(data.transport.length == 0){
            return NextResponse.json({
                success: false,
                message: "Вам нужно выбрать хотя бы 1 тип транспорта для доставки",
            });
        }

        if(!data.maxCost || !data.maxLenght || !data.maxDuration){
            return NextResponse.json({
                success: false,
                message: "Вы не указали maxCost или maxLenght или maxDuration",
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

                if(sellerCityProductFit.length == 0){
                    sellerCityProductFit = basket[i].product.sellerCityProducts;

                    //Проверяем, доставляет ли магазин в город, который выбран у пользователя
                    for (let j = 0; j < basket[i].product.user.cityWay.length; j++) {

                        //Проверяем доставляет ли магазин выбраным транспортом
                        for(let v = 0; v < basket[i].product.user.cityWay[j].cityWayTransport.length; v++){
                            if ((basket[i].product.user.cityWay[j].idCity1 == cityUser?.city.id ||
                                basket[i].product.user.cityWay[j].idCity2 == cityUser?.city.id) &&
                                data.transport.includes(basket[i].product.user.cityWay[j].cityWayTransport[v].idTransport) &&
                                basket[i].product.user.sellerSity.find((item:any) => item.idCity == cityUser?.city.id && item.typePoint == "PickPoint")
                            ) {
                                isDeliveryProduct = true;
                            }
                        }
                    }



                    if(isDeliveryProduct){
                        //объект графа
                        let graph: any = {}
                        let graph2: any = {}
                        let graph3: any = {}

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
                            graph2[topCityUser[q].city.name] = {}
                            graph3[topCityUser[q].city.name] = {}
                        }

                        //Связи в граф
                        for(let w = 0; w < basket[i].product.user.cityWay.length; w++){
                            //Наименьшее количество времени между городами
                            let masDuration: any = [];
                            let masCost: any = [];
                            let masLengh: any = [];
                            for (let o = 0; o < basket[i].product.user.cityWay[w].cityWayTransport.length; o++) {
                                if(data.transport.includes(basket[i].product.user.cityWay[w].cityWayTransport[o].idTransport)){
                                    masDuration.push(basket[i].product.user.cityWay[w].cityWayTransport[o].duration);
                                    masCost.push(basket[i].product.user.cityWay[w].cityWayTransport[o].cost);
                                    masLengh.push(basket[i].product.user.cityWay[w].cityWayTransport[o].length);
                                }
                            }

                            if (masDuration.length > 0) {
                                graph[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masDuration);
                                graph[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masDuration);

                                graph2[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masCost);
                                graph2[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masCost);

                                graph3[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masLengh);
                                graph3[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masLengh);
                            }
                        }

                        //Переменная, которая хранит значение найден или не найден хоть 1 маршрут в графе
                        let routeExists;

                        


                        let mainGraph:any = []

                        //Находим все кротчайшие маршруты до всех складов
                        for(let e = 0; e < sellerCityProductFit.length; e++){
                            let paths = findPathsAndSums(convertGraphFormat(graph), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);
                            let paths2 = findPathsAndSums(convertGraphFormat(graph2), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);
                            let paths3 = findPathsAndSums(convertGraphFormat(graph3), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);

                            mainGraph[e] = mergePaths([paths, paths2, paths3]);
                        }


                        if (mainGraph.length == 0) {
                            result[i] = {
                                id_product: basket[i].id_product,
                                id_basket: basket[i].id,
                                count_path: 0,
                                path: null,
                                all_duration: 0,
                                all_cost: 0,
                                all_length: 0,
                                quantity: basket[i].quantity,
                                product: basket[i].product
                            };
                            continue;
                        }

                        let mainResult:any = []
                        // let mainResultBest = [];

                        for(let z = 0; z < mainGraph.length; z++){
                            let tempAllDuration = Number.MAX_SAFE_INTEGER;
                            let tempAllCost = Number.MAX_SAFE_INTEGER;
                            let tempAllLenght = Number.MAX_SAFE_INTEGER;
                            let count = 0;
                            let indexBestPathZ = 0;
                            let indexBestPathX = 0;
                            let name;
                            for(let x = 0; x < mainGraph[z].length; x++){

                                if(tempAllDuration > mainGraph[z][x]['parameters'][0] &&
                                 tempAllCost > mainGraph[z][x]['parameters'][1] &&
                                 tempAllLenght > mainGraph[z][x]['parameters'][2]
                                ){
                                    tempAllDuration = mainGraph[z][x]['parameters'][0]
                                    tempAllCost = mainGraph[z][x]['parameters'][1]
                                    tempAllLenght = mainGraph[z][x]['parameters'][2]
                                    indexBestPathZ = z
                                    indexBestPathX = x
                                }

                                const getCount = await db.sellerCityProducts.findFirst({
                                    where: {
                                        idProduct: basket[i].id_product,
                                        sellerCity: {
                                            city: {
                                                name: Object.keys(mainGraph[z][x]['path'][0])[0]
                                            }
                                        }
                                    }
                                });

                                const getUserCity = await db.user.findUnique({
                                    where: {
                                        id: session.user.id
                                    },
                                    include: {
                                        city: true
                                    }
                                })

                                name = Object.keys(mainGraph[z][x]['path'][0])[0];
                                if(getUserCity?.city.name == name){
                                    const getDeliveryInfo = await db.user.findUnique({
                                        where: {
                                            id: basket[i].product.user.id
                                        }
                                    })
                                    tempAllCost = getDeliveryInfo?.deliveryCost!
                                    tempAllDuration = getDeliveryInfo?.deliveryTime!
                                }
                                count = getCount?.count!;
                            }

                            mainResult.push({city: name, count, indexBestPathZ, indexBestPathX, costMin: tempAllCost, durationMin: tempAllDuration, lenghtMin: tempAllLenght })
                        }

                        let newResult = []

                        for(let t = 0; t < mainResult.length; t++){
                            if(data.maxDuration >= mainResult[t].durationMin &&
                                data.maxCost >= mainResult[t].costMin &&
                                data.maxLenght >= mainResult[t].lenghtMin
                            ){
                                newResult.push(mainResult[t])
                            }
                        }

                        if(!newResult){
                            result[i] = {
                                id_product: basket[i].id_product,
                                id_basket: basket[i].id,
                                count_path: 0,
                                path: null,
                                all_duration: 0,
                                all_cost: 0,
                                all_length: 0,
                                quantity: basket[i].quantity,
                                product: basket[i].product
                            };
                            continue;
                        }

                        let middleResult = getAllCombinations(newResult)

                        let resultBEST = []
                        let bestCount = Number.MAX_SAFE_INTEGER;
                        let bestCost = Number.MAX_SAFE_INTEGER;
                        let bestDuration = Number.MAX_SAFE_INTEGER;
                        let bestLength = Number.MAX_SAFE_INTEGER;

                        for(let k = 0; k < middleResult.length; k++){
                            let count = middleResult[k].reduce((acc:any, item:any) => acc+=item.count, 0)
                            let cost = middleResult[k].reduce((acc:any, item:any) => acc+=item.costMin, 0)
                            let duration = middleResult[k].reduce((acc:any, item:any) => acc+=item.durationMin, 0)
                            let length = middleResult[k].reduce((acc:any, item:any) => acc+=item.lenghtMin, 0)
                            if(basket[i].quantity <= count){
                                if(bestCount >= count && bestCost >= cost && bestDuration >= duration && bestLength >= length){
                                    bestCount = count;
                                    bestCost = cost;
                                    bestDuration = duration;
                                    bestLength = length;
                                    resultBEST = middleResult[k];
                                }
                            }
                        }

                        if(resultBEST.length == 0){
                            result[i] = {
                                id_product: basket[i].id_product,
                                id_basket: basket[i].id,
                                count_path: 0,
                                path: null,
                                all_duration: 0,
                                all_cost: 0,
                                all_length: 0,
                                quantity: basket[i].quantity,
                                product: basket[i].product
                            };
                            continue;
                        }

                        let resultPath = []
                        let all_duration = Number.MIN_SAFE_INTEGER;
                        let all_cost = 0;
                        let all_length = 0;

                        for(let q = 0; q < resultBEST.length; q++){
                            //console.log(mainGraph[resultBEST[q].indexBestPathZ][resultBEST[q].indexBestPathX])
                            resultPath.push(mainGraph[resultBEST[q].indexBestPathZ][resultBEST[q].indexBestPathX])
                            all_duration = Math.max(all_duration, resultBEST[q].durationMin)
                            all_cost += resultBEST[q].costMin
                            all_length += resultBEST[q].lenghtMin
                        }

                        result[i] = {
                            id_product: basket[i].id_product,
                            id_basket: basket[i].id,
                            count_path: resultPath.length,
                            path: [resultPath],
                            all_duration: all_duration,
                            all_cost: all_cost,
                            all_length: all_length,
                            quantity: basket[i].quantity,
                            product: basket[i].product
                        };
                    }else{
                        result[i] = {
                            id_product: basket[i].id_product,
                            id_basket: basket[i].id,
                            count_path: 0,
                            path: null,
                            all_duration: 0,
                            all_cost: 0,
                            all_length: 0,
                            quantity: basket[i].quantity,
                            product: basket[i].product
                        };
                        continue;

                    }
                }else{
                    //Проверяем, доставляет ли магазин в город, который выбран у пользователя
                    for(let j = 0; j < basket[i].product.user.cityWay.length; j++){
                        //Проверяем доставляет ли магазин выбраным транспортом
                        for(let v = 0; v < basket[i].product.user.cityWay[j].cityWayTransport.length; v++){
                            if ((basket[i].product.user.cityWay[j].idCity1 == cityUser?.city.id ||
                                basket[i].product.user.cityWay[j].idCity2 == cityUser?.city.id) &&
                                data.transport.includes(basket[i].product.user.cityWay[j].cityWayTransport[v].idTransport) &&
                                basket[i].product.user.sellerSity.find((item:any) => item.idCity == cityUser?.city.id && item.typePoint == "PickPoint")
                            ) {
                                isDeliveryProduct = true;
                            }
                        }
                    }

                    if(isDeliveryProduct){
                        //объект графа
                        let graph: any = {}
                        let graph2: any = {}
                        let graph3: any = {}

                        //Получаем все вершины продавца
                        const topCityUser = basket[i].product.user.sellerSity.reduce((o: any, i: any) => {
                            if (!o.find((v: { idCity: any; }) => v.idCity == i.idCity)) {o.push(i);}
                            return o;
                        }, []);

                        //Добавлем вершины в граф
                        for(let q = 0; q < topCityUser.length; q++){
                            graph[topCityUser[q].city.name] = {}
                            graph2[topCityUser[q].city.name] = {}
                            graph3[topCityUser[q].city.name] = {}
                        }

                        //Связи в граф
                        for(let w = 0; w < basket[i].product.user.cityWay.length; w++){
                            //Наименьшее количество времени между городами
                            let masDuration: any = [];
                            let masCost: any = [];
                            let masLengh: any = [];
                            for (let o = 0; o < basket[i].product.user.cityWay[w].cityWayTransport.length; o++) {
                                if(data.transport.includes(basket[i].product.user.cityWay[w].cityWayTransport[o].idTransport)){
                                    masDuration.push(basket[i].product.user.cityWay[w].cityWayTransport[o].duration);
                                    masCost.push(basket[i].product.user.cityWay[w].cityWayTransport[o].cost);
                                    masLengh.push(basket[i].product.user.cityWay[w].cityWayTransport[o].length);
                                }
                            }

                            if (masDuration.length > 0) {
                                graph[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masDuration);
                                graph[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masDuration);

                                graph2[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masCost);
                                graph2[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masCost);

                                graph3[basket[i].product.user.cityWay[w].city1.name][
                                    basket[i].product.user.cityWay[w].city2.name
                                ] = Math.min(...masLengh);
                                graph3[basket[i].product.user.cityWay[w].city2.name][
                                    basket[i].product.user.cityWay[w].city1.name
                                ] = Math.min(...masLengh);
                            }
                        }

                        let routeExists;

                        let mainGraph:any = []
                        const kostil:any = []

                        //Находим все кротчайшие маршруты до всех складов
                        for(let e = 0; e < sellerCityProductFit.length; e++){
                            let paths = findPathsAndSums(convertGraphFormat(graph), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);
                            let paths2 = findPathsAndSums(convertGraphFormat(graph2), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);
                            let paths3 = findPathsAndSums(convertGraphFormat(graph3), sellerCityProductFit[e].sellerCity.city.name, cityUser?.city.name);

                            mainGraph = mergePaths([paths, paths2, paths3]);
                        }

                        if (mainGraph.length == 0) {
                            result[i] = {
                                id_product: basket[i].id_product,
                                id_basket: basket[i].id,
                                count_path: 0,
                                path: null,
                                all_duration: 0,
                                all_cost: 0,
                                all_length: 0,
                                quantity: basket[i].quantity,
                                product: basket[i].product
                            };
                            continue;
                        }

                        let mainResult:any = []
                        let mainResultBest = [];

                        for(let z = 0; z < mainGraph.length; z++){
                            // for(let x = 0; x < mainGraph.length; x++){

                                if(data.maxDuration >= mainGraph[z]['parameters'][0] &&
                                    data.maxCost >= mainGraph[z]['parameters'][1] &&
                                    data.maxLenght >= mainGraph[z]['parameters'][2]){
                                    mainResult.push(mainGraph[z])
                                    // console.log(mainGraph[z]['parameters'][0])

                                    //находим наилучший
                                    if(mainResultBest.length == 0){
                                        mainResultBest = mainGraph[z]
                                    }else if(mainResultBest['parameters'][0] > mainGraph[z]['parameters'][0] &&
                                            mainResultBest['parameters'][1] > mainGraph[z]['parameters'][1] &&
                                            mainResultBest['parameters'][2] > mainGraph[z]['parameters'][2]
                                    ){
                                        mainResultBest = mainGraph[z];
                                    }
                                }
                            // }
                        }

                        result[i] = {
                            id_product: basket[i].id_product,
                            id_basket: basket[i].id,
                            count_path: 1,
                            path: [mainResultBest],
                            all_duration: mainResultBest['parameters'][0],
                            all_cost: mainResultBest['parameters'][1],
                            all_length: mainResultBest['parameters'][2],
                            quantity: basket[i].quantity,
                            product: basket[i].product
                        };

                    }else {
                        result[i] = {
                            id_product: basket[i].id_product,
                            id_basket: basket[i].id,
                            count_path: 0,
                            path: null,
                            all_duration: 0,
                            all_cost: 0,
                            all_length: 0,
                            quantity: basket[i].quantity,
                            product: basket[i].product
                        };
                        continue;
                    }
                }
            }

            return NextResponse.json({ success: true, message: "Самый дешёвый маршрут построен!", result });
        }
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            error: e.message,
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


//Сомбинации всех вохможных маршрутов
function getAllCombinations(inputArray: any) {
    var resultArray:any = [];
    var combine = function() {
      for (var i in inputArray) {
        var temp: any = [];
        var tempResult: any = [];
        for (var j in arguments) {
          tempResult.push(inputArray[arguments[j]]);
          if (arguments[j] == i) {
            temp = false;
          } else if (temp) {
            temp.push(arguments[j]);
          }
        }
        if (temp) {
          temp.push(i);
          combine.apply(null, temp);
        }
      }
      if (tempResult.length > 0) {
        resultArray.push(tempResult);
      }
      return resultArray;
    };
    return combine();
}


function hasRoute(graph:any, start:any, end:any, visited:any) {
    visited[start] = true;

    if (start === end) {
        return true;
    }

    for (let i = 0; i < graph[start].length; i++) {
        const neighbor = graph[start][i];
        if (!visited[neighbor] && hasRoute(graph, neighbor, end, visited)) {
            return true;
        }
    }

    return false;
}

function convertGraphToArray(graph:any) {
    const graphArray:any = {};

    for (const vertex in graph) {
        graphArray[vertex] = Object.keys(graph[vertex]);
    }

    return graphArray;
}


function convertGraphFormat(graph:any) {
    const graphConverted:any = {};

    for (let vertex in graph) {
        graphConverted[vertex] = Object.entries(graph[vertex]).map(([neighbor, value]) => ({ [neighbor]: value }));
    }

    return graphConverted;
}

function findAllPathsAndSum(graph:any, start:any, end:any, visited:any, path:any, paths:any, calcParameter:any) {
    visited[start] = true;
    path.push({ [start]: calcParameter }); // Добавляем город с его расстоянием в виде объекта

    if (start === end) {
        paths.push({ path: [...path] });
    } else {
        for (let neighbor of graph[start]) {
            let neighborVertex = Object.keys(neighbor)[0];
            if (!visited[neighborVertex]) {
                let edgeDistance = neighbor[neighborVertex];
                findAllPathsAndSum(graph, neighborVertex, end, visited, path, paths, calcParameter + edgeDistance);
            }
        }
    }

    path.pop();
    visited[start] = false;
}

// Функция для поиска всех маршрутов и расстояний по каждому маршруту
function findPathsAndSums(graph:any, start:any, end:any) {
    const visited:any = {};
    const path:any = [];
    const paths:any = [];

    findAllPathsAndSum(graph, start, end, visited, path, paths, 0);

    // Поменяем формат путей на требуемый
    for (let result of paths) {
        let formattedPath = result.path.map((node:any) => {
            let city = Object.keys(node)[0];
            let distance = node[city];
            return { [city]: distance };
        });
        result.path = formattedPath;
    }

    return paths;
}

interface PathStep {
    [city: string]: number;
}

interface Path {
    path: PathStep[];
    parameters: number[];
}

function extractLastValues(paths: PathStep[]): number[] {
    return paths.map(step => Object.values(step)[0]).slice(-1);
}

function mergePaths(pathsData: any): Path[] {
    const [ paths, paths2, paths3 ] = pathsData;
    const mergedPaths: Path[] = [];

    for (let i = 0; i < paths.length; i++) {
        const newPath: PathStep[] = paths[i].path.map((step: any) => ({ ...step }));
        const durationValues = extractLastValues(paths[i].path);
        const costValues = extractLastValues(paths2[i].path);
        const distanceValues = extractLastValues(paths3[i].path);
        const parameters: number[] = [...durationValues, ...costValues, ...distanceValues];

        mergedPaths.push({ path: newPath, parameters });
    }

    return mergedPaths;
}
