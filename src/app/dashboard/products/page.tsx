/* eslint-disable @next/next/no-img-element */
"use client";
import styles from "./products.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import { Input, InputNumber, InputPicker, Toggle } from "rsuite";
import MyButton from "@/components/UI/MyInput/MyButton";
import axios from "axios";
import toast from "react-hot-toast";

export default function Products() {
    const inputFile = useRef<any>(null);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState<any>([]);

    const [warehouse, setWarehouse] = useState<any>([]);

    function updateProducts(id: string, item: any, property: any) {
        const nextShapes = products.map((characteristic: any) => {
            if (characteristic.id != id) {
                // No change
                return characteristic;
            } else {
                // Return a new circle 50px below
                switch (item) {
                    case "name":
                        return {
                            ...characteristic,
                            name: property,
                        };
                    case "price":
                        return {
                            ...characteristic,
                            price: property,
                        };
                    case "category":
                        return {
                            ...characteristic,
                            category: property,
                        };
                    case "length":
                        return {
                            ...characteristic,
                            length: property,
                        };
                    case "width":
                        return {
                            ...characteristic,
                            width: property,
                        };
                    case "height":
                        return {
                            ...characteristic,
                            height: property,
                        };
                    case "weight":
                        return {
                            ...characteristic,
                            weight: property,
                        };
                    case "description":
                        return {
                            ...characteristic,
                            description: property,
                        };
                    case "status":
                        return {
                            ...characteristic,
                            status: property,
                        };
                    case "count":
                        return {
                            ...characteristic,
                            count: property,
                        };
                }
            }
        });
        setProducts(nextShapes);
    }

    function updateCount(id: string, property: any) {
        const nextShapes = warehouse.map((characteristic: any) => {
            if (characteristic.idCity != id) {
                // No change
                return characteristic;
            } else {
                // Return a new circle 50px below
                return {
                    ...characteristic,
                    count: property,
                };
            }
        });
        setWarehouse(nextShapes);
    }

    useEffect(() => {
        axios.get(`/api/products/category`).then((res) => {
            setCategories(
                res.data?.category.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))
            );
        });

        axios.get(`/api/products?user_id=true`).then((res) => {
            setProducts(res.data?.product);
        });

        axios.get(`/api/profile/points?count=true`).then((res) => {
            if (res.data?.points.length != 0) {
                setWarehouse(res.data?.points);
            }
        });
    }, []);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        category: "", //Сатегория
        length: 0, //Длинна
        width: 0, //Ширина
        height: 0, //Высота
        weight: 0, //Вес
        description: "",
        status: true,
        count: 0,
    });

    const hendlerInput = () => {
        inputFile.current.click();
    };

    const createProduct = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        formData.append("name", newProduct.name);
        formData.append("price", `${newProduct.price}`);
        formData.append("category", newProduct.category);
        formData.append("length", `${newProduct.length}`);
        formData.append("width", `${newProduct.width}`);
        formData.append("height", `${newProduct.height}`);
        formData.append("weight", `${newProduct.weight}`);
        formData.append("description", newProduct.description);
        formData.append("status", `${newProduct.status}`);
        formData.append("count", `${newProduct.count}`);

        let countAll = 0;

        for (let i = 0; i < warehouse.length; i++) {
            if(warehouse[i].typePoint == "Warehouse"){
                countAll = countAll + warehouse[i].count;
            }
        }
        if (newProduct.count < countAll) {
            toast.error("Общее количество товаров меньше, чем на складах");
        } else {
            axios.post(`/api/products`, formData).then((res) => {
                if (res.data.success) {
                    // toast.success(res.data.message);
                    let product = res.data.product;
                    axios
                        .post(`/api/products/warehouse`, JSON.stringify({ warehouse, product }))
                        .then((res) => {
                            if (res.data.success) {
                                toast.success(res.data.message);
                            } else {
                                toast.error(res.data.message);
                            }
                        });

                    axios.get(`/api/products?user_id=true`).then((res) => {
                        setProducts(res.data?.product);
                    });
                } else {
                    toast.error(res.data.message);
                }
            });
        }
    };

    const updateProduct = async (item: any) => {
        const formData = new FormData();
        formData.append("id", item.id);
        formData.append("name", item.name);
        formData.append("price", item.price);
        formData.append("category", item.idCategory);
        formData.append("length", item.length);
        formData.append("width", item.width);
        formData.append("height", item.height);
        formData.append("weight", item.weight);
        formData.append("description", item.description);
        formData.append("status", `${item.status}`);
        formData.append("count", `${item.count}`);

        axios.put(`/api/products`, formData).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        });
    };

    const deleteProduct = async (item: any) => {
        axios.delete(`/api/products?id=${item.id}`).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                axios.get(`/api/products?user_id=true`).then((res) => {
                    setProducts(res.data?.product);
                });
            } else {
                toast.error(res.data.message);
            }
        });
    };

    useEffect(() => {
        if (typeof session == "object") {
            setLoading(false);
        }
    }, [session]);

    if (loading) {
        return <Loading />;
    }

    if (session == null) {
        return <div>Вы не авторизированы</div>;
    }

    return (
        <div className={`${styles.main} main`}>
            <div className={`${styles.container} container`}>
                <div className="kenost-window">
                    <div className="kenost-title">Добавить новый товар</div>
                    <div className={styles.addProduct}>
                        <div className={styles.addProductLeft}>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Название товара</p>
                                    <Input
                                        placeholder="Введите название товара"
                                        value={newProduct.name}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, name: value })
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Количество товаров</p>
                                    <InputNumber
                                        placeholder="Введите количество товаров"
                                        value={newProduct.count}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, count: Number(value) })
                                        }
                                    />
                                </div>
                            </div>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Цена товара</p>
                                    <InputNumber
                                        placeholder="Введите цену"
                                        value={newProduct.price}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, price: Number(value) })
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Категория товара</p>
                                    <InputPicker
                                        data={categories}
                                        value={newProduct.category}
                                        onChange={(value: any) =>
                                            setNewProduct({ ...newProduct, category: value })
                                        }
                                        placeholder="Выберите город"
                                    />
                                </div>
                            </div>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Длина</p>
                                    <InputNumber
                                        placeholder="Длина (мм)"
                                        value={newProduct.length}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, length: Number(value) })
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Ширина</p>
                                    <InputNumber
                                        placeholder="Ширина (мм)"
                                        value={newProduct.width}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, width: Number(value) })
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Высота</p>
                                    <InputNumber
                                        placeholder="Высота (мм)"
                                        value={newProduct.height}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, height: Number(value) })
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Вес</p>
                                    <InputNumber
                                        placeholder="Вес (г)"
                                        value={newProduct.weight}
                                        min={0}
                                        onChange={(value, e) =>
                                            setNewProduct({ ...newProduct, weight: Number(value) })
                                        }
                                    />
                                </div>
                            </div>
                            <p className={`${styles.label} ${styles.marginTop}`}>Описание</p>
                            <Input
                                as="textarea"
                                rows={3}
                                placeholder="Описание вашего товара"
                                value={newProduct.description}
                                onChange={(value, e) =>
                                    setNewProduct({ ...newProduct, description: value })
                                }
                            />
                            {warehouse.map((item: any) =>
                                item.typePoint == "Warehouse" ? (
                                    <div key={item.id} className={styles.addProductFlex}>
                                        <div className={styles.addProductFlexEl}>
                                            <p className={styles.label}>Склад</p>
                                            <Input value={item.city.name} disabled />
                                        </div>
                                        <div className={styles.addProductFlexEl}>
                                            <p className={styles.label}>Количество товаров</p>
                                            <InputNumber
                                                placeholder="Введите количество товаров"
                                                value={item.count}
                                                min={0}
                                                onChange={(value, e) =>
                                                    updateCount(item.idCity, Number(value))
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )
                            )}

                            <div className={styles.addProductFlex}>
                                <MyButton onClick={() => createProduct()}>Добавить</MyButton>
                                <Toggle
                                    checkedChildren="On"
                                    unCheckedChildren="Off"
                                    checked={newProduct.status}
                                    onChange={(value) =>
                                        setNewProduct({ ...newProduct, status: value })
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.addProductRight}>
                            <input
                                onChange={({ target }) => {
                                    if (target.files) {
                                        const file = target.files[0];
                                        setSelectedFile(file);
                                    }
                                }}
                                type="file"
                                ref={inputFile}
                                className="hidden"
                            />
                            <p className={styles.label}>Изображения товара</p>
                            <div className={styles.addProductImage} onClick={hendlerInput}>
                                <i className="pi pi-image"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${styles.title} kenost-title`}>Добавленные товары</div>
                {products.map((item: any) => (
                    <div key={item.id} className={`${styles.window} kenost-window`}>
                        <img
                            className={styles.allProductImage}
                            src={
                                item.image != null
                                    ? `/products/${item.image}`
                                    : `/quickshopimage.png`
                            }
                            alt=""
                        />
                        <div className={styles.allProductText}>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Название товара</p>
                                    <Input
                                        placeholder="Введите название товара"
                                        value={item.name}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "name", value)
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Категория товара</p>
                                    <InputPicker
                                        data={categories}
                                        value={item.idCategory}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "idCategory", value)
                                        }
                                        placeholder="Выберите город"
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Цена товара</p>
                                    <InputNumber
                                        placeholder="Введите цену"
                                        value={item.price}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "price", value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Длина</p>
                                    <InputNumber
                                        placeholder="Длина (мм)"
                                        value={item.length}         
                                        min={0}                               
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "length", value)
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Ширина</p>
                                    <InputNumber
                                        placeholder="Ширина (мм)"
                                        value={item.width}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "width", value)
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Высота</p>
                                    <InputNumber
                                        placeholder="Высота (мм)"
                                        value={item.height}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "height", value)
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Вес</p>
                                    <InputNumber
                                        placeholder="Вес (г)"
                                        value={item.weight}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "weight", value)
                                        }
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Количество</p>
                                    <InputNumber
                                        placeholder="Количество товаров"
                                        value={item.count}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateProducts(item.id, "count", value)
                                        }
                                    />
                                </div>
                            </div>
                            <p className={`${styles.label} ${styles.marginTop}`}>Описание</p>
                            <Input
                                as="textarea"
                                rows={3}
                                placeholder="Описание вашего товара"
                                value={item.description}
                                onChange={(value, e) =>
                                    updateProducts(item.id, "description", value)
                                }
                            />
                            <div className={styles.addProductFlex}>
                                <MyButton onClick={() => updateProduct(item)}>Изменить</MyButton>
                                <MyButton
                                    style={{ background: "#FF6464", color: "#FFF" }}
                                    onClick={() => deleteProduct(item)}>
                                    Удалить
                                </MyButton>
                                <Toggle
                                    checkedChildren="On"
                                    unCheckedChildren="Off"
                                    checked={item.status}
                                    onChange={(value, e) =>
                                        updateProducts(item.id, "status", value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
