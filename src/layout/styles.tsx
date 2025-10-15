// Clases CSS centralizadas para los componentes del layout
// HEADER STYLES
export const headerStyles = {
    headerClass: "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm",
    containerClass: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    flexClass: "flex items-center justify-between h-16",
    brandClass: "flex items-center space-x-3",
    iconClass: "w-8 h-8 text-primary-600",
    titleClass: "text-xl font-semibold text-gray-900 hidden sm:block",
    mobileTitleClass: "text-lg font-semibold text-gray-900 sm:hidden"
};

export const sidebarStyles = {
    containerClass: "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 z-40 flex flex-col",
    navClass: "flex-1 p-4 space-y-2",
    linksClass: "space-y-1 text-gray-600",
    linkClass: "flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-600 hover:shadow-sm transition-all duration-200",
    iconClass: "w-5 h-5 mr-3 text-gray-600",
    logoutContainerClass: "p-4 border-t border-gray-200",
    logoutBtnClass: "flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 hover:shadow-sm transition-all duration-200"
};

export const footerStyles = {
    footerClass: "fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 z-30",
    containerClass: "px-6 py-4",
    textClass: "text-sm text-gray-500 text-center"
};

export const mainLayoutStyles = {
    containerClass: "min-h-screen bg-gray-50/30",
    flexClass: "flex",
    mainClass: "flex-1 ml-64 pt-16 pb-20 min-h-screen",
    contentClass: "p-6"
};

export const commonStyles = {
    // Contenedores
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
    
    // Texto
    textPrimary: "text-gray-600",
    textSecondary: "text-gray-500",
    textDanger: "text-red-600",
    
    // Backgrounds
    bgWhite: "bg-white",
    bgPrimary: "bg-gray-50",
    
    // Borders
    borderGray: "border-gray-200",
    borderTop: "border-t",
    borderRight: "border-r",
    borderBottom: "border-b",
    
    // Shadows
    shadowSm: "shadow-sm",
    
    // Transitions
    transition: "transition-all duration-200",
    
    // Padding & Margins
    p4: "p-4",
    px6: "px-6",
    py4: "py-4",
    mr3: "mr-3"
};