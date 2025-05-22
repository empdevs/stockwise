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
}