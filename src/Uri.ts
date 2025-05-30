export class Uri {
    public static get rootUri(): string { return import.meta.env["VITE_APP_API_ROOT"] || "" }
    public static get GetSuppliers(): string { return import.meta.env["VITE_APP_API_GET_SUPPLIERS"] || "" }
    public static get InsertSupplier(): string { return import.meta.env["VITE_APP_API_INSERT_SUPPLIER"] || "" }
    public static get PatchSupplier(): string { return import.meta.env["VITE_APP_API_PATCH_SUPPLIER"] || "" }
    public static get DeleteSupplier(): string { return import.meta.env["VITE_APP_API_DELETE_SUPPLIER"] || "" }
    public static get InsertSupplierAssessment(): string { return import.meta.env["VITE_APP_API_INSERT_SUPPLIER_ASSESSMENT"] || "" }
    public static get GetSupplierAssessments(): string { return import.meta.env["VITE_APP_API_GET_SUPPLIER_ASSESSMENTS"] || "" }
    public static get GetSupplierAssessmentDetail(): string { return import.meta.env["VITE_APP_API_GET_SUPPLIER_ASSESSMENT_DETAIL"] || "" }
    public static get PatchSupplierAssessment(): string { return import.meta.env["VITE_APP_API_PATCH_SUPPLIER_ASSESSMENT"] || "" }
    public static get GetItems(): string { return import.meta.env["VITE_APP_API_GET_ITEMS"] || "" }
    public static get GetCategories(): string { return import.meta.env["VITE_APP_API_GET_CATEGORIES"] || "" }
    public static get GetItemUnits(): string { return import.meta.env["VITE_APP_API_GET_ITEM_UNITS"] || "" }
    public static get InsertItem(): string { return import.meta.env["VITE_APP_API_GET_INSERT_ITEM"] || "" }
    public static get PatchItem(): string { return import.meta.env["VITE_APP_API_PATCH_ITEM"] || "" }
    public static get DeleteItem(): string { return import.meta.env["VITE_APP_API_DELETE_ITEM"] || "" }
    public static get GetIncomingStock(): string { return import.meta.env["VITE_APP_API_GET_INCOMING_STOCK"] || "" }
    public static get InsertIncomingStock(): string { return import.meta.env["VITE_APP_API_INSERT_INCOMING_STOCK"] || "" }
    public static get CreateTransaction(): string { return import.meta.env["VITE_APP_API_CREATE_TRANSACTION"] || "" }
    public static get GetTransactions(): string { return import.meta.env["VITE_APP_API_GET_TRANSACTIONS"] || "" }
    public static get login(): string { return import.meta.env["VITE_APP_API_LOGIN"] || "" }
    public static get refreshToken(): string { return import.meta.env["VITE_APP_API_REFRESH_TOKEN"] || "" }
    public static get GetLowStockItems(): string { return import.meta.env["VITE_APP_API_GET_LOW_STOCK_ITEMS"] || "" }
}