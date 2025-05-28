export interface ISupplier {
    id: string,
    supplierCode: string,
    name: string,
    phone: number,
    email: string,
    address: string,
    createdAt: string
}

export interface IResponse<T> {
    data: T,
    error: boolean,
    message: string,
}


export interface ISupplierAssessment {
    id?: string, //Not mandatory in front end
    supplierId: string,
    supplierCode: string,
    supplierName: string,
    initiationCriteria: ICriteria,
    normalizationCriteria?: ICriteria,
    finalScore?: number,
    createdAt?: string  //Not mandatory in front end
}


interface ICriteria {
    productQuality: number,
    onTimeDelivery: number,
    stockAvailability: number,
    completnessDocument: number,
    warranty: number,
    easeOrderingProcess: number,
    productPrice: number,
    shippingCost: number,
}


export type ActionMode = "CREATE" | "EDIT" | "DELETE" | "VIEW"
export type SortDirection = 'asc' | 'desc';

export type PriorityType = "1_VeryLow" | "2_Low" | "3_Medium" | "4_High" | "5_VeryHigh";

export interface IItem {
    id?: string,  //Not mandatory in front end
    itemCode: string,
    name: string,
    description: string,
    categoryId: string,
    categoryCode: string,
    categoryName: string,
    unitId: string,
    unitCode: string
    unitName: string,
    priority: PriorityType,
    stock: number,
    minimumStock: number,
    unitPrice: number,
    sellingPrice: number,
    lastTimeRestocked?: string, //Not mandatory in front end
    createdAt?: string, //Not mandatory in front end
}

export interface ICategory {
    id: string,
    categoryCode: string,
    name: string,
    createdAt: string
}

export interface IItemUnit {
    id: string,
    unitCode: string,
    name: string,
    createdAt: string
}

export type ActionType = "create" | "update" | "delete" | "sold" | "restocked";

interface IChanges {
    fieldName: keyof IItem,
    oldValue: any,
    newValue: any
}

export interface IAuditTrail {
    id?: string,
    itemId: string,
    itemCode: string,
    action: ActionType,
    changes: IChanges[],
    description?: string,
    createdAt?: string
}

export interface IIncomingStock {
    id?: string,
    itemId: string,
    itemCode: string,
    itemName: string,
    categoryId: string,
    categoryCode: string
    categoryName: string,
    unitId: string,
    unitCode: string,
    unitName: string,
    supplierId: string,
    supplierCode: string,
    supplierName: string,
    unitPrice: number,
    stockQuantityReceived: number,
    createdAt?: string
}

export interface IOptionTypeCustom<T> {
    value: string,
    label: string,
    data?: T
}

export const priorityOptions: IOptionTypeCustom<any>[] = [
    { value: "1_VeryLow", label: "Very Low" },
    { value: "2_Low", label: "Low" },
    { value: "3_Medium", label: "Medium" },
    { value: "4_High", label: "High" },
    { value: "5_VeryHigh", label: "Very High" },
]


export interface IPurchasedItem {
    id: string,
    itemCode: string,
    name: string,
    unitId: string,
    unitCode: string,
    unitName: string,
    stock: number,
    sellingPrice: number,
    quantity: number,
    discount: string,
    total: number, //This is total amount after discount,

    isSelected?: boolean //Only when add items, this property will not be added into database
}
export interface IPayment {
    method: "1_cash" | "2_bca" | "3_bri" | "4_mandiri" | "5_qris" | "6_gopay" | "7_ovo",
    amountPaid: number,
    change: number
}

export interface ITransaction {
    id?: string,
    invoiceId?: string,
    customerName: string,
    customerContact: string,
    invoiceDate?: string,
    items: IPurchasedItem[],
    subTotal: number, //This is sub total amount before discount
    discount: string,
    total: number,  //This is total amount after discount
    payment: IPayment,
    vat: {
        vatRate: string,
        vatAmount: number
    }
    createdAt?: string
}

export interface IUser {
    id: string,
    username: string,
    accessToken?: string
}

export interface ITokenInfo {
    userId: string,
    username: string,
}