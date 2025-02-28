import ListComponent from "./list";
import UserFormModal from "./warehouseForm";

export default function WarehouseList() {

    return (
        <div>
            <div className="text-xl">
                Warehouse
            </div>
            <div>
                <UserFormModal />
            </div>

            <div>
                <ListComponent />
            </div>
        </div>
    );
}
