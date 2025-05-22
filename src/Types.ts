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


export type ActionMode = "CREATE" | "EDIT" | "DELETE"
export type SortDirection = 'asc' | 'desc';