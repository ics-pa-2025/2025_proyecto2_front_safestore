// Clases reutilizables para formularios
export const formStyles = {
  // Contenedores principales
  pageContainer: "h-full flex flex-col",
  
  // Header del formulario
  header: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0",
  title: "text-xl sm:text-2xl font-bold text-slate-800",
  
  // Contenedor de botones del header
  buttonContainer: "flex flex-col sm:flex-row gap-2 sm:gap-3",
  
  // Botones
  cancelButton: "flex items-center justify-center min-h-9 sm:min-h-10 bg-slate-600 text-white text-sm sm:text-base p-2 sm:p-3 rounded-md hover:bg-slate-700 transition-colors",
  submitButton: "flex items-center justify-center min-h-9 sm:min-h-10 bg-blue-600 text-white text-sm sm:text-base p-2 sm:p-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  
  // Formulario
  formContainer: "flex-1",
  form: "space-y-4 sm:space-y-6",
  
  // Grid para campos
  fieldGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  fullWidthField: "md:col-span-2",
  
  // Campos de entrada
  fieldWrapper: "",
  label: "block text-sm sm:text-base font-medium text-slate-700 mb-1",
  required: "text-red-500",
  input: "w-full p-1 sm:p-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  textarea: "w-full p-1 sm:p-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y",
  select: "w-full p-1 sm:p-2 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  
  // Estados especiales
  disabledInput: "w-full p-1 sm:p-2 text-sm sm:text-base border border-slate-300 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed",
  
  // Mensajes de error
  errorMessage: "mt-1 text-xs sm:text-sm text-red-600",
  
  // Loading state
  loadingContainer: "flex items-center justify-center min-h-96",
  loadingContent: "text-center",
  loadingSpinner: "inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-slate-200 border-t-blue-500",
  loadingText: "mt-4 text-sm sm:text-base text-slate-600 font-medium"
};