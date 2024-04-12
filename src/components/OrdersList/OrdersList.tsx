import EmptyOrders from "../EmptyBasket/EmptyOrders";
import Title from "../UI/Title.components";
import styles from "./OrdersList.module.scss";
import OrdersListItem from "./OrdersListItem";
import { OrderType } from "./types";

const OrdersList = ({ orders }: { orders: OrderType[] }) => {
    return (
        <>
            {orders?.length ? (
                <>
                    <section className={`${styles["orders"]} container`}>
                        <Title text="Заказы" margin={false} />
                        <div className={`${styles["orders__container"]}`}>
                            {orders?.map((order, index) => {
                                return <OrdersListItem key={order.id} order={order} />;
                            })}
                        </div>
                    </section>
                </>
            ) : (
                <EmptyOrders />
            )}
        </>
    );
};

export default OrdersList;
