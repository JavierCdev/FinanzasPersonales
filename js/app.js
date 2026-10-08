// ============================================================
// FINANZAS PERSONALES
// app.js
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://ecgshuyxokeqikpchsbf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Y9USSLp_ANtygPbJ-foiug_Pm0hqM8u";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    // ============================================================
// AUTENTICACIÓN
// ============================================================

const loginScreen =
    document.getElementById("loginScreen");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");


function showLogin() {

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

}


function hideLogin() {

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

}


function showLoginMessage(message) {

    if (loginMessage) {
        loginMessage.textContent = message;
    }

}


async function checkAuthentication() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

        showLogin();

        showLoginMessage(
            "No fue posible comprobar la sesión."
        );

        return;
    }


    if (data.session) {

        hideLogin();

        console.log(
            "Sesión activa."
        );

    } else {

        showLogin();

        console.log(
            "No hay una sesión activa."
        );

    }

}


loginForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        showLoginMessage("");


        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email || !password) {

            showLoginMessage(
                "Ingresa tu correo y contraseña."
            );

            return;
        }


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


        if (error) {

            console.error(
                "Error iniciando sesión:",
                error
            );

            showLoginMessage(
                "Correo o contraseña incorrectos."
            );

            return;
        }


        if (data.session) {

            hideLogin();

            loginForm.reset();

            showLoginMessage("");

            console.log(
                "Inicio de sesión correcto."
            );

        }

    }
);


// Detectar cambios de sesión

supabaseClient.auth.onAuthStateChange(
    (_event, session) => {

        if (session) {

            hideLogin();

        } else {

            showLogin();

        }

    }
);


// Comprobar sesión al cargar

checkAuthentication();

// ============================================================
// 1. NAVEGACIÓN
// ============================================================

const menuButtons = document.querySelectorAll(".menu-item");
const pageSections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("pageTitle");

const sectionTitles = {
    dashboard: "Dashboard",
    ingresos: "Ingresos",
    gastos: "Gastos",
    presupuesto: "Presupuesto",
    fijos: "Gastos Fijos",
    reportes: "Reportes",
    configuracion: "Configuración"
};

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.dataset.section;

        menuButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        pageSections.forEach(item => {
            item.classList.remove("active");
        });

        const target = document.getElementById(section);

        if (target) {
            target.classList.add("active");
        }

        if (pageTitle) {
            pageTitle.textContent =
                sectionTitles[section] || "Finanzas Personales";
        }
    });

});


// ============================================================
// 2. CATEGORÍAS
// ============================================================

const defaultCategories = {

    income: [
        "Sueldo",
        "Bonificación",
        "Horas Extras",
        "Vacaciones",
        "Transferencias"
    ],

    expense: [
        "Accesorios",
        "Mantenimiento",
        "Refacción Angie",
        "Citas médicas",
        "Combustible",
        "Comida y restaurantes",
        "Cuidado Personal",
        "Visa Cuotas",
        "Entretenimiento",
        "Extra Financiamiento",
        "Hospedaje",
        "Seguro",
        "Suscripciones",
        "Útiles Escolares"
    ]

};


function createId(type) {

    return (
        type +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


function createDefaultCategories(type) {

    return defaultCategories[type].map(name => {

        return {
            id: createId(type),
            name: name,
            active: true
        };

    });

}


function loadCategories() {

    const saved =
        localStorage.getItem("finanzasCategorias");


    // --------------------------------------------------------
    // No existen categorías todavía
    // --------------------------------------------------------

    if (!saved) {

        const newCategories = {

            income: createDefaultCategories("income"),

            expense: createDefaultCategories("expense")

        };

        localStorage.setItem(
            "finanzasCategorias",
            JSON.stringify(newCategories)
        );

        return newCategories;
    }


    // --------------------------------------------------------
    // Intentar leer categorías existentes
    // --------------------------------------------------------

    try {

        const data = JSON.parse(saved);


        return {

            income: normalizeCategories(
                data.income,
                "income"
            ),

            expense: normalizeCategories(
                data.expense,
                "expense"
            )

        };

    } catch (error) {

        console.error(
            "Error leyendo categorías:",
            error
        );


        const newCategories = {

            income: createDefaultCategories("income"),

            expense: createDefaultCategories("expense")

        };


        localStorage.setItem(
            "finanzasCategorias",
            JSON.stringify(newCategories)
        );


        return newCategories;
    }

}


function normalizeCategories(list, type) {

    // --------------------------------------------------------
    // Si no existe o está vacío
    // --------------------------------------------------------

    if (!Array.isArray(list) || list.length === 0) {

        return createDefaultCategories(type);

    }


    return list
        .map(category => {

            // -----------------------------------------------
            // Categoría antigua guardada como texto
            // -----------------------------------------------

            if (typeof category === "string") {

                const name = category.trim();

                if (!name) {
                    return null;
                }

                return {

                    id: createId(type),

                    name: name,

                    active: true

                };

            }


            // -----------------------------------------------
            // Categoría guardada como objeto
            // -----------------------------------------------

            if (
                category &&
                typeof category === "object"
            ) {

                const name =
                    String(category.name || "").trim();


                if (!name) {
                    return null;
                }


                return {

                    id:
                        category.id ||
                        createId(type),

                    name: name,

                    // Si no existe active,
                    // la consideramos activa.
                    active:
                        category.active === false
                            ? false
                            : true

                };

            }


            return null;

        })
        .filter(Boolean);

}


let categories = loadCategories();


function saveCategories() {

    localStorage.setItem(
        "finanzasCategorias",
        JSON.stringify(categories)
    );

}

// ============================================================
// SUPABASE - CATEGORÍAS
// ============================================================

async function getCurrentUser() {

    const {
        data,
        error
    } = await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;
    }

    return data.user || null;

}


async function initializeCategories() {

    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar categorías."
        );

        renderCategories();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("categorias")
            .select(
                "id, type, name, active"
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        // ----------------------------------------------------
        // SUPABASE YA TIENE CATEGORÍAS
        // ----------------------------------------------------

        if (data && data.length > 0) {

            categories = {

                income: data
                    .filter(
                        category =>
                            category.type === "income"
                    )
                    .map(category => ({

                        id: category.id,

                        name: category.name,

                        active:
                            category.active !== false

                    })),

                expense: data
                    .filter(
                        category =>
                            category.type === "expense"
                    )
                    .map(category => ({

                        id: category.id,

                        name: category.name,

                        active:
                            category.active !== false

                    }))

            };


            saveCategories();

            renderCategories();

            console.log(
                "Categorías cargadas desde Supabase."
            );

            return;
        }


        // ----------------------------------------------------
        // SUPABASE ESTÁ VACÍO
        // MIGRAR CATEGORÍAS LOCALES
        // ----------------------------------------------------

        const rows = [

            ...categories.income.map(
                category => ({

                    id: category.id,

                    user_id: user.id,

                    type: "income",

                    name: category.name,

                    active:
                        category.active !== false

                })
            ),

            ...categories.expense.map(
                category => ({

                    id: category.id,

                    user_id: user.id,

                    type: "expense",

                    name: category.name,

                    active:
                        category.active !== false

                })
            )

        ];


        if (rows.length > 0) {

            const {
                error: insertError
            } = await supabaseClient
                .from("categorias")
                .insert(rows);


            if (insertError) {
                throw insertError;
            }

        }


        saveCategories();

        renderCategories();

        console.log(
            "Categorías locales migradas a Supabase."
        );


    } catch (error) {

        console.error(
            "Error cargando categorías desde Supabase:",
            error
        );

        // Si Supabase falla, mantenemos
        // las categorías locales como respaldo.

        renderCategories();

    }

}


// ============================================================
// 3. CONFIGURACIÓN DE CATEGORÍAS
// ============================================================

const incomeCategoriesList =
    document.getElementById(
        "incomeCategoriesList"
    );


const expenseCategoriesList =
    document.getElementById(
        "expenseCategoriesList"
    );


const addIncomeCategory =
    document.getElementById(
        "addIncomeCategory"
    );


const addExpenseCategory =
    document.getElementById(
        "addExpenseCategory"
    );


const showInactive = {

    income: false,

    expense: false

};


function renderCategories() {

    renderCategoryList(
        "income",
        incomeCategoriesList
    );


    renderCategoryList(
        "expense",
        expenseCategoriesList
    );


    populateIncomeCategories();

}


function renderCategoryList(type, container) {

    if (!container) {
        return;
    }


    const list =
        Array.isArray(categories[type])
            ? categories[type]
            : [];


    const active =
        list.filter(
            category => category.active !== false
        );


    const inactive =
        list.filter(
            category => category.active === false
        );


    const visible =
        showInactive[type]
            ? list
            : active;


    let html = "";


    html += `
        <div class="category-list-header">

            <span>
                ${active.length} activa(s)

                ${
                    inactive.length
                        ? ` · ${inactive.length} inactiva(s)`
                        : ""
                }
            </span>

            ${
                inactive.length
                    ? `
                        <button
                            type="button"
                            class="category-filter-button"
                            data-category-filter="${type}"
                        >
                            ${
                                showInactive[type]
                                    ? "Ocultar inactivas"
                                    : `Mostrar inactivas (${inactive.length})`
                            }
                        </button>
                    `
                    : ""
            }

        </div>
    `;


    if (visible.length === 0) {

        html += `
            <div class="category-empty">
                No hay categorías.
            </div>
        `;

        container.innerHTML = html;

        return;
    }


    html += `
        <div class="category-list">
    `;


    visible.forEach(category => {

        html += `

            <div
                class="category-item ${
                    category.active === false
                        ? "inactive-category"
                        : ""
                }"
            >

                <div class="category-info">

                    <span
                        class="category-status ${
                            category.active === false
                                ? "inactive"
                                : ""
                        }"
                    ></span>

                    <span class="category-name">
                        ${escapeHtml(category.name)}
                    </span>

                </div>


                <div class="category-actions">

                    <button
                        type="button"
                        class="category-button"
                        data-category-action="edit"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="category-button"
                        data-category-action="toggle"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        ${
                            category.active === false
                                ? "Activar"
                                : "Desactivar"
                        }
                    </button>


                    <button
                        type="button"
                        class="category-button delete"
                        data-category-action="delete"
                        data-category-type="${type}"
                        data-category-id="${category.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });


    html += `
        </div>
    `;


    container.innerHTML = html;

}


// ============================================================
// 4. CATEGORÍAS EN FORMULARIO DE INGRESOS
// ============================================================

function populateIncomeCategories() {

    const select =
        document.getElementById(
            "incomeCategory"
        );


    if (!select) {

        console.error(
            "No existe #incomeCategory en index.html"
        );

        return;
    }


    // Guardamos la selección actual
    const currentValue =
        select.value;


    // --------------------------------------------------------
    // IMPORTANTE:
    // Solo consideramos inactivas las que explícitamente
    // tengan active === false.
    // --------------------------------------------------------

    const activeCategories =
        categories.income.filter(
            category =>
                category.active !== false
        );


    // Limpiar selector
    select.innerHTML = "";


    // Opción inicial
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Selecciona una categoría";

    select.appendChild(
        defaultOption
    );


    // --------------------------------------------------------
    // Crear opciones
    // --------------------------------------------------------

    activeCategories.forEach(category => {

        const option =
            document.createElement("option");


        option.value =
            category.id;


        option.textContent =
            category.name;


        select.appendChild(
            option
        );

    });


    // --------------------------------------------------------
    // Mantener selección anterior
    // --------------------------------------------------------

    if (
        currentValue &&
        activeCategories.some(
            category =>
                category.id === currentValue
        )
    ) {

        select.value =
            currentValue;

    }


    // --------------------------------------------------------
    // Seguridad:
    // si por alguna razón no hay categorías,
    // recuperar las predeterminadas.
    // --------------------------------------------------------

    if (
        activeCategories.length === 0
    ) {

        categories.income =
            createDefaultCategories("income");


        saveCategories();


        populateIncomeCategories();

    }

}


// ============================================================
// 5. AGREGAR CATEGORÍA
// ============================================================

async function addCategory(type) {

    const label =
        type === "income"
            ? "ingreso"
            : "gasto";


    const value =
        prompt(
            `Nombre de la nueva categoría de ${label}:`
        );


    if (value === null) {
        return;
    }


    const name =
        value.trim();


    if (!name) {

        alert(
            "Debes ingresar un nombre."
        );

        return;
    }


    const exists =
        categories[type].some(
            category =>
                category.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        alert(
            "Ya existe una categoría con ese nombre."
        );

        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        alert(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
        );

        return;
    }


    const newCategory = {

        id: createId(type),

        name: name,

        active: true

    };


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .insert({

            id: newCategory.id,

            user_id: user.id,

            type: type,

            name: newCategory.name,

            active: true

        });


    if (error) {

        console.error(
            "Error creando categoría:",
            error
        );

        alert(
            "No se pudo guardar la categoría."
        );

        return;
    }


    categories[type].push(
        newCategory
    );


    saveCategories();

    renderCategories();

}

if (addIncomeCategory) {

    addIncomeCategory.addEventListener(
        "click",
        () => addCategory("income")
    );

}


if (addExpenseCategory) {

    addExpenseCategory.addEventListener(
        "click",
        () => addCategory("expense")
    );

}


// ============================================================
// 6. EDITAR / ACTIVAR / ELIMINAR CATEGORÍA
// ============================================================

function findCategory(type, id) {

    return categories[type].find(
        category =>
            category.id === id
    );

}


async function editCategory(type, id) {

    const category =
        findCategory(type, id);


    if (!category) {
        return;
    }


    const newName =
        prompt(
            "Nuevo nombre de la categoría:",
            category.name
        );


    if (newName === null) {
        return;
    }


    const name =
        newName.trim();


    if (!name) {

        alert(
            "El nombre no puede estar vacío."
        );

        return;
    }


    const duplicate =
        categories[type].some(
            item =>
                item.id !== id &&
                item.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (duplicate) {

        alert(
            "Ya existe otra categoría con ese nombre."
        );

        return;
    }


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .update({

            name: name,

            updated_at:
                new Date().toISOString()

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error editando categoría:",
            error
        );

        alert(
            "No se pudo actualizar la categoría."
        );

        return;
    }


    category.name =
        name;


    saveCategories();

    renderCategories();

}

async function toggleCategory(type, id) {

    const category =
        findCategory(type, id);


    if (!category) {
        return;
    }


    const newActive =
        category.active === false;


    const {
        error
    } = await supabaseClient
        .from("categorias")
        .update({

            active: newActive,

            updated_at:
                new Date().toISOString()

        })
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error cambiando estado de categoría:",
            error
        );

        alert(
            "No se pudo cambiar el estado de la categoría."
        );

        return;
    }


    category.active =
        newActive;


    saveCategories();

    renderCategories();

}


function categoryHasTransactions(
    type,
    id
) {

    const storageKey =
        type === "income"
            ? "finanzasIngresos"
            : "finanzasGastos";


    let transactions = [];


    try {

        transactions =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            ) || [];

    } catch {

        transactions = [];

    }


    return transactions.some(
        transaction =>
            transaction.categoryId === id
    );

}


async function deleteCategory(type, id) {

    const category =
        findCategory(type, id);

        const user = await getCurrentUser();

if (!user) {
    alert(
        "Tu sesión ha expirado. Inicia sesión nuevamente."
    );
    return;
}


    if (!category) {
        return;
    }


    if (
        categoryHasTransactions(
            type,
            id
        )
    ) {

        const deactivate =
            confirm(
                `La categoría "${category.name}" ya tiene transacciones asociadas.\n\n` +
                `No podemos eliminarla porque perderíamos la referencia histórica.\n\n` +
                `¿Quieres desactivarla?`
            );


        if (deactivate) {

            await toggleCategory(
                type,
                id
            );

        }


        return;
    }


    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar "${category.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const {
    data: deletedRows,
    error
} = await supabaseClient
    .from("categorias")
    .delete()
    .eq(
        "id",
        id
    )
    .eq(
        "user_id",
        user.id
    )
    .select("id");


if (error) {

    console.error(
        "Error eliminando categoría:",
        error
    );

    alert(
        "No se pudo eliminar la categoría."
    );

    return;

}


console.log(
    "Categoría eliminada de Supabase:",
    deletedRows
);


if (
    !deletedRows ||
    deletedRows.length === 0
) {

    console.error(
        "DELETE ejecutado, pero Supabase no eliminó ninguna fila."
    );

    alert(
        "Supabase no eliminó la categoría. Revisa las políticas RLS de DELETE."
    );

    return;

}



    categories[type] =
        categories[type].filter(
            item =>
                item.id !== id
        );


    saveCategories();

    renderCategories();

}


document.addEventListener(
    "click",
    event => {

        const categoryButton =
            event.target.closest(
                "[data-category-action]"
            );


        if (categoryButton) {

            const action =
                categoryButton.dataset.categoryAction;


            const type =
                categoryButton.dataset.categoryType;


            const id =
                categoryButton.dataset.categoryId;


            if (action === "edit") {

                editCategory(
                    type,
                    id
                );

            }


            if (action === "toggle") {

                toggleCategory(
                    type,
                    id
                );

            }


            if (action === "delete") {

                deleteCategory(
                    type,
                    id
                );

            }


            return;
        }


        const filterButton =
            event.target.closest(
                "[data-category-filter]"
            );


        if (filterButton) {

            const type =
                filterButton.dataset.categoryFilter;


            showInactive[type] =
                !showInactive[type];


            renderCategories();

        }

    }
);


// ============================================================
// 7. INGRESOS
// ============================================================

let incomes = [];


try {

    incomes =
        JSON.parse(
            localStorage.getItem(
                "finanzasIngresos"
            )
        ) || [];

} catch {

    incomes = [];

}


function saveIncomes() {

    localStorage.setItem(
        "finanzasIngresos",
        JSON.stringify(incomes)
    );

}

// ============================================================
// SUPABASE - INGRESOS
// ============================================================

async function initializeIncomes() {

    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar ingresos."
        );

        renderIncomeTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("ingresos")
            .select(`
                id,
                date,
                description,
                category_id,
                category_name,
                currency,
                amount,
                exchange_rate,
                amount_gtq,
                exchange_rate_source,
                notes,
                created_at,
                updated_at
            `)
            .order(
                "date",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseIncomes =
            data || [];


        // ====================================================
        // MIGRAR INGRESOS LOCALES QUE TODAVÍA NO EXISTEN
        // EN SUPABASE
        // ====================================================

        const existingIds =
            new Set(
                supabaseIncomes.map(
                    income =>
                        income.id
                )
            );


        const incomesToMigrate =
            incomes.filter(
                income =>
                    !existingIds.has(
                        income.id
                    )
            );


        if (
            incomesToMigrate.length > 0
        ) {

            const rows =
                incomesToMigrate.map(
                    income => ({

                        id:
                            income.id,

                        user_id:
                            user.id,

                        date:
                            income.date,

                        description:
                            income.description,

                        category_id:
                            income.categoryId,

                        category_name:
                            income.categoryName,

                        currency:
                            income.currency,

                        amount:
                            income.amount,

                        exchange_rate:
                            income.exchangeRate || 1,

                        amount_gtq:
                            income.amountGTQ,

                        exchange_rate_source:
                            income.exchangeRateSource || null,

                        notes:
                            income.notes || null,

                        created_at:
                            income.createdAt ||
                            new Date().toISOString(),

                        updated_at:
                            income.updatedAt ||
                            new Date().toISOString()

                    })
                );


            const {
                data: migratedData,
                error: migrationError
            } = await supabaseClient
                .from("ingresos")
                .insert(rows)
                .select(`
                    id,
                    date,
                    description,
                    category_id,
                    category_name,
                    currency,
                    amount,
                    exchange_rate,
                    amount_gtq,
                    exchange_rate_source,
                    notes,
                    created_at,
                    updated_at
                `);


            if (migrationError) {
                throw migrationError;
            }


            supabaseIncomes.push(
                ...(migratedData || [])
            );


            console.log(
                `${incomesToMigrate.length} ingreso(s) local(es) migrado(s) a Supabase.`
            );

        }


        // ====================================================
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ====================================================

        incomes =
            supabaseIncomes.map(
                income => ({

                    id:
                        income.id,

                    date:
                        income.date,

                    description:
                        income.description,

                    categoryId:
                        income.category_id,

                    categoryName:
                        income.category_name,

                    currency:
                        income.currency,

                    amount:
                        Number(
                            income.amount
                        ),

                    exchangeRate:
                        Number(
                            income.exchange_rate
                        ),

                    amountGTQ:
                        Number(
                            income.amount_gtq
                        ),

                    exchangeRateSource:
                        income.exchange_rate_source ||
                        "",

                    notes:
                        income.notes ||
                        "",

                    createdAt:
                        income.created_at,

                    updatedAt:
                        income.updated_at

                })
            );


        // Mantenemos localStorage temporalmente
        // como respaldo.

        saveIncomes();

        renderIncomeTable();


        console.log(
            "Ingresos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando ingresos con Supabase:",
            error
        );

        // Si Supabase falla, conservamos
        // los datos locales como respaldo.

        renderIncomeTable();

    }

}


// Elementos

const newIncomeButton =
    document.getElementById(
        "newIncomeButton"
    );


const incomeFormPanel =
    document.getElementById(
        "incomeFormPanel"
    );


const incomeForm =
    document.getElementById(
        "incomeForm"
    );


const incomeId =
    document.getElementById(
        "incomeId"
    );


const incomeDate =
    document.getElementById(
        "incomeDate"
    );


const incomeDescription =
    document.getElementById(
        "incomeDescription"
    );


const incomeCategory =
    document.getElementById(
        "incomeCategory"
    );


const incomeCurrency =
    document.getElementById(
        "incomeCurrency"
    );


const incomeAmount =
    document.getElementById(
        "incomeAmount"
    );


const incomeExchangeGroup =
    document.getElementById(
        "incomeExchangeGroup"
    );


const incomeExchangeRate =
    document.getElementById(
        "incomeExchangeRate"
    );


const refreshExchangeRate =
    document.getElementById(
        "refreshExchangeRate"
    );


const exchangeRateStatus =
    document.getElementById(
        "exchangeRateStatus"
    );


const incomeAmountGTQ =
    document.getElementById(
        "incomeAmountGTQ"
    );


const incomeNotes =
    document.getElementById(
        "incomeNotes"
    );


const cancelIncomeButton =
    document.getElementById(
        "cancelIncomeButton"
    );


const incomeTableContainer =
    document.getElementById(
        "incomeTableContainer"
    );


// ============================================================
// 8. ABRIR FORMULARIO
// ============================================================

function openIncomeForm(
    income = null
) {

    if (
        !incomeFormPanel ||
        !incomeForm
    ) {

        console.error(
            "No existe el formulario de ingresos."
        );

        return;
    }


    incomeFormPanel.style.display = "block";


    // Siempre reconstruimos las categorías
    // antes de mostrar el formulario.
    populateIncomeCategories();


    if (income) {

        incomeId.value =
            income.id;


        incomeDate.value =
            income.date;


        incomeDescription.value =
            income.description;


        incomeCategory.value =
            income.categoryId;


        incomeCurrency.value =
            income.currency;


        incomeAmount.value =
            income.amount;


        incomeNotes.value =
            income.notes || "";


        if (
            income.currency === "USD"
        ) {

            incomeExchangeGroup.hidden =
                false;


            incomeExchangeRate.value =
                income.exchangeRate || "";

        } else {

            incomeExchangeGroup.hidden =
                true;


            incomeExchangeRate.value =
                "";

        }


        updateIncomeConversion();


    } else {

        incomeForm.reset();


        incomeId.value =
            "";


        incomeDate.value =
            new Date()
                .toISOString()
                .split("T")[0];


        incomeCurrency.value =
            "GTQ";


        incomeExchangeGroup.hidden =
            true;


        incomeExchangeRate.value =
            "";


        incomeAmountGTQ.textContent =
            "Q 0.00";


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "";

        }


        populateIncomeCategories();

    }


    incomeDate.focus();

}


function closeIncomeForm() {

    if (!incomeFormPanel) {
        return;
    }


    incomeFormPanel.style.display = "none";


    if (incomeForm) {
        incomeForm.reset();
    }


    if (incomeId) {
        incomeId.value = "";
    }


    if (incomeExchangeGroup) {
        incomeExchangeGroup.hidden = true;
    }


    if (incomeAmountGTQ) {

        incomeAmountGTQ.textContent =
            "Q 0.00";

    }


    if (exchangeRateStatus) {

        exchangeRateStatus.textContent =
            "";

    }

}


if (newIncomeButton) {

    newIncomeButton.addEventListener(
        "click",
        () => openIncomeForm()
    );

}


if (cancelIncomeButton) {

    cancelIncomeButton.addEventListener(
        "click",
        closeIncomeForm
    );

}


// ============================================================
// 9. MONEDA
// ============================================================

function updateIncomeCurrencyUI() {

    if (!incomeCurrency) {
        return;
    }


    const currency =
        incomeCurrency.value;


    if (
        currency === "USD"
    ) {

        incomeExchangeGroup.hidden =
            false;


        if (
            !incomeExchangeRate.value
        ) {

            fetchExchangeRate();

        }

    } else {

        incomeExchangeGroup.hidden =
            true;


        incomeExchangeRate.value =
            "";


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "";

        }

    }


    updateIncomeConversion();

}


function updateIncomeConversion() {

    if (!incomeAmountGTQ) {
        return;
    }


    const amount =
        parseFloat(
            incomeAmount?.value
        ) || 0;


    const currency =
        incomeCurrency?.value ||
        "GTQ";


    let amountGTQ = 0;


    if (
        currency === "GTQ"
    ) {

        amountGTQ =
            amount;

    } else {

        const rate =
            parseFloat(
                incomeExchangeRate?.value
            ) || 0;


        amountGTQ =
            amount * rate;

    }


    incomeAmountGTQ.textContent =
        formatCurrency(
            amountGTQ,
            "GTQ"
        );

}


if (incomeCurrency) {

    incomeCurrency.addEventListener(
        "change",
        updateIncomeCurrencyUI
    );

}


if (incomeAmount) {

    incomeAmount.addEventListener(
        "input",
        updateIncomeConversion
    );

}


if (incomeExchangeRate) {

    incomeExchangeRate.addEventListener(
        "input",
        updateIncomeConversion
    );

}


// ============================================================
// 10. TIPO DE CAMBIO
// ============================================================

async function fetchExchangeRate() {

    if (!incomeExchangeRate) {
        return;
    }


    if (exchangeRateStatus) {

        exchangeRateStatus.textContent =
            "Consultando tipo de cambio...";

    }


    if (refreshExchangeRate) {

        refreshExchangeRate.disabled =
            true;

    }


    try {

        const url =
            "https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx/TipoCambioDia";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const text =
            await response.text();


        const parser =
            new DOMParser();


        const xml =
            parser.parseFromString(
                text,
                "text/xml"
            );


        const node =
            xml.querySelector(
                "VarDolar referencia"
            );


        if (!node) {

            throw new Error(
                "No se encontró el tipo de cambio."
            );

        }


        const rate =
            parseFloat(
                node.textContent
            );


        if (
            !rate ||
            rate <= 0
        ) {

            throw new Error(
                "Tipo de cambio inválido."
            );

        }


        incomeExchangeRate.value =
            rate.toFixed(4);


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "Tipo de cambio obtenido de Banguat.";

        }


        updateIncomeConversion();


    } catch (error) {

        console.warn(
            "No se pudo obtener el tipo de cambio:",
            error
        );


        if (exchangeRateStatus) {

            exchangeRateStatus.textContent =
                "No se pudo obtener automáticamente. Puedes ingresarlo manualmente.";

        }


    } finally {

        if (refreshExchangeRate) {

            refreshExchangeRate.disabled =
                false;

        }

    }

}


if (refreshExchangeRate) {

    refreshExchangeRate.addEventListener(
        "click",
        fetchExchangeRate
    );

}


// ============================================================
// 11. GUARDAR INGRESO
// ============================================================

if (incomeForm) {

    incomeForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const date =
                incomeDate.value;

            const description =
                incomeDescription.value.trim();

            const categoryId =
                incomeCategory.value;

            const currency =
                incomeCurrency.value;

            const amount =
                parseFloat(
                    incomeAmount.value
                );

            const notes =
                incomeNotes.value.trim();


            if (!date) {

                alert(
                    "Selecciona la fecha."
                );

                return;
            }


            if (!description) {

                alert(
                    "Ingresa una descripción."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.income.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada no existe."
                );

                return;
            }

            let exchangeRate = 1;

            let amountGTQ = amount;


            if (
                currency === "USD"
            ) {

                exchangeRate =
                    parseFloat(
                        incomeExchangeRate.value
                    );


                if (
                    !exchangeRate ||
                    exchangeRate <= 0
                ) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;
                }


                amountGTQ =
                    amount *
                    exchangeRate;

            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );

                return;
            }


            const id =
                incomeId.value ||
                createId("income");


            const existingIndex =
                incomes.findIndex(
                    item =>
                        item.id === id
                );


            const now =
                new Date().toISOString();


            const existingIncome =
                existingIndex !== -1
                    ? incomes[existingIndex]
                    : null;


            const incomeData = {

                id:

                    id,

                date:

                    date,

                description:

                    description,

                categoryId:

                    category.id,

                categoryName:

                    category.name,

                currency:

                    currency,

                amount:

                    amount,

                exchangeRate:

                    exchangeRate,

                amountGTQ:

                    amountGTQ,

                exchangeRateSource:

                    currency === "USD"
                        ? "Banguat/Manual"
                        : "N/A",

                notes:

                    notes,

                createdAt:

                    existingIncome?.createdAt ||
                    now,

                updatedAt:

                    now

            };


            const databaseData = {

                id:

                    incomeData.id,

                user_id:

                    user.id,

                date:

                    incomeData.date,

                description:

                    incomeData.description,

                category_id:

                    incomeData.categoryId,

                category_name:

                    incomeData.categoryName,

                currency:

                    incomeData.currency,

                amount:

                    incomeData.amount,

                exchange_rate:

                    incomeData.exchangeRate,

                amount_gtq:

                    incomeData.amountGTQ,

                exchange_rate_source:

                    incomeData.exchangeRateSource,

                notes:

                    incomeData.notes,

                updated_at:

                    incomeData.updatedAt

            };


            let error;


            if (existingIndex !== -1) {

                const result =
                    await supabaseClient
                        .from("ingresos")
                        .update(databaseData)
                        .eq(
                            "id",
                            id
                        );

                error =
                    result.error;

            } else {

                databaseData.created_at =
                    incomeData.createdAt;

                const result =
                    await supabaseClient
                        .from("ingresos")
                        .insert(
                            databaseData
                        );

                error =
                    result.error;

            }


            if (error) {

                console.error(
                    "Error guardando ingreso en Supabase:",
                    error
                );

                alert(
                    "No se pudo guardar el ingreso."
                );

                return;
            }


            if (existingIndex !== -1) {

                incomes[existingIndex] =
                    incomeData;

            } else {

                incomes.push(
                    incomeData
                );

            }


            saveIncomes();
            renderIncomeTable();
            updateDashboard();
            closeIncomeForm();


            alert(
                existingIndex !== -1
                    ? "Ingreso actualizado correctamente."
                    : "Ingreso guardado correctamente."
            );

        }
    );

}

// ============================================================
// 12. TABLA DE INGRESOS
// ============================================================

function renderIncomeTable() {

    if (!incomeTableContainer) {
        return;
    }


   const selectedMonth = String(
    dashboardMonth?.value ||
    new Date().getMonth() + 1
).padStart(2, "0");

const selectedYear =
    dashboardYear?.value ||
    String(new Date().getFullYear());

const monthlyIncomes = incomes.filter(income => {
    if (!income.date) return false;

    const [incomeYear, incomeMonth] =
        income.date.split("-");

    return (
        incomeYear === selectedYear &&
        incomeMonth === selectedMonth
    );
});

if (monthlyIncomes.length === 0) {
    incomeTableContainer.innerHTML = `
        <div class="empty-table">
            No hay ingresos registrados en el mes seleccionado.
        </div>
    `;
    return;
}

const sorted =
    [...monthlyIncomes].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    let html = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>Fecha</th>

                    <th>Descripción</th>

                    <th>Categoría</th>

                    <th>Moneda</th>

                    <th>Monto</th>

                    <th>Equivalente GTQ</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

    `;


    sorted.forEach(income => {

        const category =
            categories.income.find(
                item =>
                    item.id ===
                    income.categoryId
            );


        const categoryName =
            category?.name ||
            income.categoryName ||
            "Categoría eliminada";


                html += `
            <tr class="income-main-row">
                <td>${formatDate(income.date)}</td>
                <td>${escapeHtml(income.description || "")}</td>
                <td>${escapeHtml(categoryName)}</td>
                <td>${escapeHtml(income.currency || "GTQ")}</td>
                <td class="income-amount">
                    ${formatCurrency(income.amount, income.currency)}
                </td>
                <td class="income-amount">
                    ${formatCurrency(income.amountGTQ, "GTQ")}
                </td>
                <td>
                    <div class="table-actions">
                        <button
                            type="button"
                            class="table-action-button"
                            data-income-action="edit"
                            data-income-id="${income.id}">
                            Editar
                        </button>
                        <button
                            type="button"
                            class="table-action-button delete"
                            data-income-action="delete"
                            data-income-id="${income.id}">
                            Eliminar
                        </button>
                    </div>
                </td>

                <td class="income-mobile-summary-cell" colspan="7">
                    <button
                        type="button"
                        class="income-mobile-toggle"
                        data-income-toggle="${income.id}"
                        aria-expanded="false">
                        <span class="income-mobile-date">
                            ${formatDate(income.date)}
                        </span>
                        <span class="income-mobile-description">
                            ${escapeHtml(income.description || "Sin descripción")}
                        </span>
                        <span class="income-mobile-category">
                            ${escapeHtml(categoryName)}
                        </span>
                        <span class="income-mobile-chevron" aria-hidden="true">⌄</span>
                    </button>
                </td>
            </tr>

            <tr
                class="income-details-row"
                data-income-details="${income.id}"
                hidden>
                <td colspan="7">
                    <div class="income-details-panel">
                        ${
                            income.description
                                ? `
                                    <div class="income-detail-item full income-detail-description">
                                        <span>Descripción completa</span>
                                        <strong>${escapeHtml(income.description)}</strong>
                                    </div>
                                `
                                : ""
                        }

                        <div class="income-detail-group">
                            <div class="income-detail-item">
                                <span>Moneda y monto</span>
                                <strong>
                                    ${formatCurrency(income.amount, income.currency)}
                                </strong>
                            </div>

                            <div class="income-detail-item">
                                <span>Equivalente en GTQ</span>
                                <strong>
                                    ${formatCurrency(income.amountGTQ, "GTQ")}
                                </strong>
                            </div>
                        </div>

                        ${
                            income.notes
                                ? `
                                    <div class="income-detail-item full income-detail-notes">
                                        <span>Notas</span>
                                        <strong>${escapeHtml(income.notes)}</strong>
                                    </div>
                                `
                                : ""
                        }

                        <div class="income-details-actions">
                            <button
                                type="button"
                                class="table-action-button"
                                data-income-action="edit"
                                data-income-id="${income.id}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="table-action-button delete"
                                data-income-action="delete"
                                data-income-id="${income.id}">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `;

    });


    html += `

            </tbody>

        </table>

    `;


    incomeTableContainer.innerHTML =
        html;

}

incomeTableContainer?.addEventListener("click", event => {
    const toggle = event.target.closest("[data-income-toggle]");

    if (!toggle || !incomeTableContainer.contains(toggle)) {
        return;
    }

    const incomeId = toggle.dataset.incomeToggle;

    const detailRows = [
        ...incomeTableContainer.querySelectorAll(".income-details-row")
    ];

    const selectedDetails = detailRows.find(
        row => row.dataset.incomeDetails === incomeId
    );

    if (!selectedDetails) return;

    const shouldOpen = selectedDetails.hidden;

    detailRows.forEach(row => {
        row.hidden = true;
    });

    incomeTableContainer
        .querySelectorAll("[data-income-toggle]")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
        });

    if (shouldOpen) {
        selectedDetails.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    }
});

// ============================================================
// 13. EDITAR / ELIMINAR INGRESOS
// ============================================================

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-income-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.incomeAction;


        const id =
            button.dataset.incomeId;


        const income =
            incomes.find(
                item =>
                    item.id === id
            );


        if (!income) {
            return;
        }


        if (
            action === "edit"
        ) {

            openIncomeForm(
                income
            );

            return;
        }


        if (
    action === "delete"
) {

    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar el ingreso "${income.description}"?`
        );


    if (!confirmed) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("ingresos")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            "Error eliminando ingreso:",
            error
        );

        alert(
            "No se pudo eliminar el ingreso."
        );

        return;
    }


    incomes =
        incomes.filter(
            item =>
                item.id !== id
        );


    saveIncomes();

    renderIncomeTable();

}

    }
);

// ============================================================
// 13. PRESUPUESTOS
// ============================================================

let budgets = JSON.parse(
    localStorage.getItem("finanzasPresupuestos")
) || [];


// ------------------------------------------------------------
// ELEMENTOS DEL FORMULARIO
// ------------------------------------------------------------

const newBudgetButton =
    document.getElementById("newBudgetButton");

const budgetFormPanel =
    document.getElementById("budgetFormPanel");

const budgetForm =
    document.getElementById("budgetForm");

const budgetFormTitle =
    document.getElementById("budgetFormTitle");

const budgetId =
    document.getElementById("budgetId");

const budgetMonth =
    document.getElementById("budgetMonth");

const budgetCategory =
    document.getElementById("budgetCategory");

const budgetAmount =
    document.getElementById("budgetAmount");

const cancelBudgetButton =
    document.getElementById("cancelBudgetButton");

const budgetTableContainer =
    document.getElementById("budgetTableContainer");


// ------------------------------------------------------------
// GUARDAR PRESUPUESTOS
// ------------------------------------------------------------

function saveBudgets() {

    localStorage.setItem(
        "finanzasPresupuestos",
        JSON.stringify(budgets)
    );

}

// ============================================================
// SUPABASE - PRESUPUESTOS
// ============================================================

async function initializeBudgets() {

    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar presupuestos."
        );

        renderBudgetTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("presupuestos")
            .select(`
                id,
                month,
                category_id,
                category_name,
                amount,
                created_at,
                updated_at
            `)
            .order(
                "month",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseBudgets =
            data || [];


        // ----------------------------------------------------
        // BUSCAR PRESUPUESTOS LOCALES QUE AÚN NO EXISTEN
        // EN SUPABASE
        // ----------------------------------------------------

        const existingIds =
            new Set(
                supabaseBudgets.map(
                    budget =>
                        budget.id
                )
            );


        const budgetsToMigrate =
            budgets.filter(
                budget =>
                    !existingIds.has(
                        budget.id
                    )
            );


        if (
            budgetsToMigrate.length > 0
        ) {

            const rows =
                budgetsToMigrate.map(
                    budget => ({

                        id:
                            budget.id,

                        user_id:
                            user.id,

                        month:
                            `${budget.month}-01`,

                        category_id:
                            budget.categoryId,

                        category_name:
                            budget.categoryName,

                        amount:
                            budget.amount,

                        created_at:
                            budget.createdAt ||
                            new Date().toISOString(),

                        updated_at:
                            budget.updatedAt ||
                            new Date().toISOString()

                    })
                );


            const {
                data: migratedData,
                error: migrationError
            } = await supabaseClient
                .from("presupuestos")
                .insert(rows)
                .select(`
                    id,
                    month,
                    category_id,
                    category_name,
                    amount,
                    created_at,
                    updated_at
                `);


            if (migrationError) {
                throw migrationError;
            }


            supabaseBudgets.push(
                ...(migratedData || [])
            );


            console.log(
                `${budgetsToMigrate.length} presupuesto(s) local(es) migrado(s) a Supabase.`
            );

        }


        // ----------------------------------------------------
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ----------------------------------------------------

        budgets =
            supabaseBudgets.map(
                budget => ({

                    id:
                        budget.id,

                    month:
                        String(
                            budget.month
                        ).substring(
                            0,
                            7
                        ),

                    categoryId:
                        budget.category_id,

                    categoryName:
                        budget.category_name,

                    amount:
                        Number(
                            budget.amount
                        ),

                    createdAt:
                        budget.created_at,

                    updatedAt:
                        budget.updated_at

                })
            );


        saveBudgets();

        renderBudgetTable();


        console.log(
            "Presupuestos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando presupuestos con Supabase:",
            error
        );

        renderBudgetTable();

    }

}

// ------------------------------------------------------------
// OBTENER GASTOS
// ------------------------------------------------------------

function getStoredExpenses() {

    return JSON.parse(
        localStorage.getItem("finanzasGastos")
    ) || [];

}


// ------------------------------------------------------------
// POPULAR CATEGORÍAS
// ------------------------------------------------------------

function populateBudgetCategories() {

    if (!budgetCategory) {
        return;
    }


    const currentValue =
        budgetCategory.value;


    budgetCategory.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;


    const expenseCategories =
        Array.isArray(categories.expense)
            ? categories.expense
            : [];


    expenseCategories
        .filter(category => category.active !== false)
        .forEach(category => {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            budgetCategory.appendChild(option);

        });


    if (currentValue) {

        const exists =
            [...budgetCategory.options]
                .some(
                    option =>
                        option.value === currentValue
                );

        if (exists) {
            budgetCategory.value =
                currentValue;
        }

    }

}


// ------------------------------------------------------------
// ABRIR FORMULARIO
// ------------------------------------------------------------

function openBudgetForm(budget = null) {

    if (!budgetFormPanel || !budgetForm) {
        return;
    }


    populateBudgetCategories();


    budgetFormPanel.hidden = false;


    if (budget) {

        budgetFormTitle.textContent =
            "Editar presupuesto";

        budgetId.value =
            budget.id;

        budgetMonth.value =
            budget.month;

        budgetCategory.value =
            budget.categoryId;

        budgetAmount.value =
            budget.amount;

    } else {

        budgetFormTitle.textContent =
            "Nuevo presupuesto";

        budgetId.value =
            "";

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        budgetMonth.value =
            `${year}-${month}`;

        budgetCategory.value =
            "";

        budgetAmount.value =
            "";

    }


    budgetMonth.focus();

}


// ------------------------------------------------------------
// CERRAR FORMULARIO
// ------------------------------------------------------------

function closeBudgetForm() {

    if (!budgetFormPanel) {
        return;
    }


    budgetFormPanel.hidden = true;


    if (budgetForm) {
        budgetForm.reset();
    }


    if (budgetId) {
        budgetId.value = "";
    }

}


// ------------------------------------------------------------
// BOTÓN NUEVO
// ------------------------------------------------------------

if (newBudgetButton) {

    newBudgetButton.addEventListener(
        "click",
        () => openBudgetForm()
    );

}


// ------------------------------------------------------------
// BOTÓN CANCELAR
// ------------------------------------------------------------

if (cancelBudgetButton) {

    cancelBudgetButton.addEventListener(
        "click",
        closeBudgetForm
    );

}


// ------------------------------------------------------------
// GUARDAR PRESUPUESTO
// ------------------------------------------------------------

if (budgetForm) {

    budgetForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const month =
                budgetMonth.value;

            const categoryId =
                budgetCategory.value;

            const amount =
                parseFloat(
                    budgetAmount.value
                );


            if (!month) {

                alert(
                    "Selecciona el mes del presupuesto."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.expense.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada ya no existe."
                );

                return;
            }


            const existingId =
                budgetId.value;


            // ------------------------------------------------
            // EVITAR DUPLICADOS
            // ------------------------------------------------

            const duplicate =
                budgets.find(
                    item =>
                        item.month === month &&
                        item.categoryId === categoryId &&
                        item.id !== existingId
                );


            if (duplicate) {

                const confirmed =
                    confirm(
                        `Ya existe un presupuesto para "${category.name}" en ${formatBudgetMonth(month)}.\n\n` +
                        `¿Quieres actualizarlo con el nuevo monto?`
                    );


                if (!confirmed) {
                    return;
                }


                const user =
                    await getCurrentUser();


                if (!user) {

                    alert(
                        "No hay un usuario autenticado."
                    );

                    return;
                }


                try {

                    const {
                        data,
                        error
                    } = await supabaseClient
                        .from("presupuestos")
                        .update({

                            category_name:
                                category.name,

                            amount:
                                amount,

                            updated_at:
                                new Date().toISOString()

                        })
                        .eq(
                            "id",
                            duplicate.id
                        )
                        .select()
                        .single();


                    if (error) {
                        throw error;
                    }


                    duplicate.amount =
                        Number(
                            data.amount
                        );

                    duplicate.categoryName =
                        data.category_name;

                    duplicate.updatedAt =
                        data.updated_at;


                    saveBudgets();

                    renderBudgetTable();

                    closeBudgetForm();


                    alert(
                        "Presupuesto actualizado correctamente."
                    );


                } catch (error) {

                    console.error(
                        "Error actualizando presupuesto en Supabase:",
                        error
                    );


                    alert(
                        "No se pudo actualizar el presupuesto en Supabase."
                    );

                }


                return;
            }


            const now =
                new Date().toISOString();


            const existingBudget =
                budgets.find(
                    item =>
                        item.id === existingId
                );


            const id =
                existingId ||
                `budget-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}`;


            const budgetData = {

                id:
                    id,

                month:
                    month,

                categoryId:
                    categoryId,

                categoryName:
                    category.name,

                amount:
                    amount,

                createdAt:
                    existingBudget?.createdAt ||
                    now,

                updatedAt:
                    now

            };


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const supabaseData = {

                    id:
                        budgetData.id,

                    user_id:
                        user.id,

                    month:
                        `${budgetData.month}-01`,

                    category_id:
                        budgetData.categoryId,

                    category_name:
                        budgetData.categoryName,

                    amount:
                        budgetData.amount,

                    created_at:
                        budgetData.createdAt,

                    updated_at:
                        budgetData.updatedAt

                };


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("presupuestos")
                    .upsert(
                        supabaseData
                    )
                    .select()
                    .single();


                if (error) {
                    throw error;
                }


                const savedBudget = {

                    id:
                        data.id,

                    month:
                        String(
                            data.month
                        ).substring(
                            0,
                            7
                        ),

                    categoryId:
                        data.category_id,

                    categoryName:
                        data.category_name,

                    amount:
                        Number(
                            data.amount
                        ),

                    createdAt:
                        data.created_at,

                    updatedAt:
                        data.updated_at

                };


                const index =
                    budgets.findIndex(
                        item =>
                            item.id === id
                    );


                if (index !== -1) {

                    budgets[index] =
                        savedBudget;

                } else {

                    budgets.push(
                        savedBudget
                    );

                }


                saveBudgets();

                renderBudgetTable();

                updateDashboard();

                closeBudgetForm();


                alert(
                    existingId
                        ? "Presupuesto actualizado correctamente."
                        : "Presupuesto guardado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error guardando presupuesto en Supabase:",
                    error
                );


                alert(
                    "No se pudo guardar el presupuesto en Supabase."
                );

            }

        }
    );

}

// ------------------------------------------------------------
// CALCULAR GASTADO
// ------------------------------------------------------------

function getSpentForBudget(
    month,
    categoryId
) {

    const expenses =
        getStoredExpenses();


    return expenses.reduce(
        (total, expense) => {

            if (
                expense.categoryId !==
                categoryId
            ) {
                return total;
            }


            if (
                !expense.date ||
                !expense.date.startsWith(month)
            ) {
                return total;
            }


            const amountGTQ =
                parseFloat(
                    expense.amountGTQ
                );


            if (
                !Number.isFinite(
                    amountGTQ
                )
            ) {
                return total;
            }


            return total + amountGTQ;

        },
        0
    );

}


// ------------------------------------------------------------
// FORMATEAR MES
// ------------------------------------------------------------

function formatBudgetMonth(month) {

    if (!month) {
        return "";
    }


    const [
        year,
        monthNumber
    ] =
        month.split("-");


    const date =
        new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );


    return date.toLocaleDateString(
        "es-GT",
        {
            month: "long",
            year: "numeric"
        }
    );

}


// ------------------------------------------------------------
// RENDERIZAR TABLA
// ------------------------------------------------------------

function renderBudgetTable() {

    if (!budgetTableContainer) {
        return;
    }


    if (budgets.length === 0) {

        budgetTableContainer.innerHTML = `
            <div class="empty-table">
                Todavía no tienes presupuestos registrados.
            </div>
        `;

        return;

    }


    const sortedBudgets =
        [...budgets].sort(
            (a, b) =>
                b.month.localeCompare(
                    a.month
                )
        );


    let html = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>
                        Mes
                    </th>

                    <th>
                        Categoría
                    </th>

                    <th>
                        Presupuesto
                    </th>

                    <th>
                        Gastado
                    </th>

                    <th>
                        Disponible
                    </th>

                    <th>
                        Progreso
                    </th>

                    <th>
                        Acciones
                    </th>

                </tr>

            </thead>

            <tbody>

    `;


    sortedBudgets.forEach(
        budget => {

            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        budget.categoryId
                );


            const categoryName =
                category?.name ||
                budget.categoryName ||
                "Categoría eliminada";


            const budgetAmount =
                parseFloat(
                    budget.amount
                ) || 0;


            const spent =
                getSpentForBudget(
                    budget.month,
                    budget.categoryId
                );


            const remaining =
                budgetAmount -
                spent;


            const percentage =
                budgetAmount > 0
                    ? (spent / budgetAmount) * 100
                    : 0;


            const progressWidth =
                Math.min(
                    percentage,
                    100
                );


            let progressClass =
                "normal";


            if (percentage >= 100) {

                progressClass =
                    "danger";

            } else if (
                percentage >= 80
            ) {

                progressClass =
                    "warning";

            }


            let remainingClass =
                "positive";


            if (remaining < 0) {

                remainingClass =
                    "negative";

            } else if (
                percentage >= 80
            ) {

                remainingClass =
                    "warning";

            }


            html += `

                <tr>

                    <td class="budget-month">

                        ${formatBudgetMonth(
                            budget.month
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            categoryName
                        )}

                    </td>


                    <td>

                        ${formatCurrency(
                            budgetAmount,
                            "GTQ"
                        )}

                    </td>


                    <td>

                        ${formatCurrency(
                            spent,
                            "GTQ"
                        )}

                    </td>


                    <td>

                        <span
                            class="budget-remaining ${remainingClass}"
                        >

                            ${formatCurrency(
                                remaining,
                                "GTQ"
                            )}

                        </span>

                    </td>


                    <td>

                        <div
                            class="budget-progress"
                        >

                            <div
                                class="budget-progress-bar"
                            >

                                <div
                                    class="budget-progress-fill ${progressClass}"
                                    style="width: ${progressWidth}%"
                                ></div>

                            </div>


                            <div
                                class="budget-percentage"
                            >

                                ${percentage.toFixed(1)}%

                            </div>

                        </div>

                    </td>


                    <td>

                        <div
                            class="table-actions"
                        >

                            <button
                                type="button"
                                class="table-action-button"
                                data-budget-action="edit"
                                data-budget-id="${budget.id}"
                            >

                                Editar

                            </button>


                            <button
                                type="button"
                                class="table-action-button delete"
                                data-budget-action="delete"
                                data-budget-id="${budget.id}"
                            >

                                Eliminar

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }
    );


    html += `

            </tbody>

        </table>

    `;


    budgetTableContainer.innerHTML =
        html;

}


// ------------------------------------------------------------
// EDITAR / ELIMINAR
// ------------------------------------------------------------

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-budget-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.budgetAction;

        const id =
            button.dataset.budgetId;


        const budget =
            budgets.find(
                item =>
                    item.id === id
            );


        if (!budget) {
            return;
        }


        // ------------------------------------------------
        // EDITAR
        // ------------------------------------------------

        if (
            action === "edit"
        ) {

            openBudgetForm(
                budget
            );

            return;
        }


        // ------------------------------------------------
        // ELIMINAR
        // ------------------------------------------------

        if (
            action === "delete"
        ) {

            const confirmed =
                confirm(
                    `¿Seguro que quieres eliminar el presupuesto de "${budget.categoryName}" para ${formatBudgetMonth(budget.month)}?`
                );


            if (!confirmed) {
                return;
            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const {
                    error
                } = await supabaseClient
                    .from("presupuestos")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


                if (error) {
                    throw error;
                }


                budgets =
                    budgets.filter(
                        item =>
                            item.id !== id
                    );


                saveBudgets();

                renderBudgetTable();


                alert(
                    "Presupuesto eliminado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error eliminando presupuesto de Supabase:",
                    error
                );


                alert(
                    "No se pudo eliminar el presupuesto de Supabase."
                );

            }

        }

    }
);

// ------------------------------------------------------------
// INICIALIZAR PRESUPUESTOS
// ------------------------------------------------------------

populateBudgetCategories();

renderBudgetTable();

// ============================================================
// 14. GASTOS
// ============================================================

let expenses = [];

try {

    expenses =
        JSON.parse(
            localStorage.getItem(
                "finanzasGastos"
            )
        ) || [];

} catch {

    expenses = [];

}


// ============================================================
// ELEMENTOS
// ============================================================

const newExpenseButton =
    document.getElementById(
        "newExpenseButton"
    );

const expenseFormPanel =
    document.getElementById(
        "expenseFormPanel"
    );

const expenseForm =
    document.getElementById(
        "expenseForm"
    );

const expenseId =
    document.getElementById(
        "expenseId"
    );

const expenseDate =
    document.getElementById(
        "expenseDate"
    );

const expenseDescription =
    document.getElementById(
        "expenseDescription"
    );

const expenseCategory =
    document.getElementById(
        "expenseCategory"
    );

const expenseCurrency =
    document.getElementById(
        "expenseCurrency"
    );

const expenseAmount =
    document.getElementById(
        "expenseAmount"
    );

const expenseExchangeGroup =
    document.getElementById(
        "expenseExchangeGroup"
    );

const expenseExchangeRate =
    document.getElementById(
        "expenseExchangeRate"
    );

const refreshExpenseExchangeRate =
    document.getElementById(
        "refreshExpenseExchangeRate"
    );

const expenseExchangeRateStatus =
    document.getElementById(
        "expenseExchangeRateStatus"
    );

const expenseAmountGTQ =
    document.getElementById(
        "expenseAmountGTQ"
    );

const expenseNotes =
    document.getElementById(
        "expenseNotes"
    );

const cancelExpenseButton =
    document.getElementById(
        "cancelExpenseButton"
    );

const expenseTableContainer =
    document.getElementById(
        "expenseTableContainer"
    );

const creditCardStatementsContainer =
    document.getElementById(
        "creditCardStatementsContainer"
    );  

    const expensePaymentMethod =
    document.getElementById("expensePaymentMethod");

const expenseCreditCardGroup =
    document.getElementById("expenseCreditCardGroup");

const expenseCreditCardId =
    document.getElementById("expenseCreditCardId");

expensePaymentMethod?.addEventListener("change", () => {
    const usesCard =
        expensePaymentMethod.value === "card";

    expenseCreditCardGroup.hidden = !usesCard;
    expenseCreditCardId.required = usesCard;

    if (!usesCard) {
        expenseCreditCardId.value = "";
    }
});

// ============================================================
// GUARDAR GASTOS
// ============================================================

function saveExpenses() {

    localStorage.setItem(
        "finanzasGastos",
        JSON.stringify(expenses)
    );

}

// ============================================================
// SUPABASE - GASTOS
// ============================================================

async function initializeExpenses() {

    const user = await getCurrentUser();

    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar gastos."
        );

        renderExpenseTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("gastos")
            .select(`
                id,
                date,
                description,
                category_id,
                category_name,
                currency,
                amount,
                exchange_rate,
                amount_gtq,
                exchange_rate_source,
                notes,
                payment_method,
                credit_card_id,
                statement_cutoff_date,
                statement_due_date,
                created_at,
                updated_at
            `)
            .order(
                "date",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseExpenses =
            data || [];


        // ====================================================
        // BUSCAR GASTOS LOCALES QUE AÚN NO EXISTEN
        // EN SUPABASE
        // ====================================================

        const existingIds =
            new Set(
                supabaseExpenses.map(
                    expense =>
                        expense.id
                )
            );


        const expensesToMigrate =
            expenses.filter(
                expense =>
                    !existingIds.has(
                        expense.id
                    )
            );


        if (
            expensesToMigrate.length > 0
        ) {

            const rows =
                expensesToMigrate.map(
                    expense => ({

                        id:
                            expense.id,

                        user_id:
                            user.id,

                        date:
                            expense.date,

                        description:
                            expense.description,

                        category_id:
                            expense.categoryId,

                        category_name:
                            expense.categoryName,

                        currency:
                            expense.currency,

                        amount:
                            expense.amount,

                        exchange_rate:
                            expense.exchangeRate || 1,

                        amount_gtq:
                            expense.amountGTQ,

                        exchange_rate_source:
                            expense.exchangeRateSource || null,

                        notes:
                            expense.notes || null,

                        created_at:
                            expense.createdAt ||
                            new Date().toISOString(),

                        updated_at:
                            expense.updatedAt ||
                            new Date().toISOString()

                    })
                );


            const {
                data: migratedData,
                error: migrationError
            } = await supabaseClient
                .from("gastos")
                .insert(rows)
                .select(`
                    id,
                    date,
                    description,
                    category_id,
                    category_name,
                    currency,
                    amount,
                    exchange_rate,
                    amount_gtq,
                    exchange_rate_source,
                    notes,
                    created_at,
                    updated_at
                `);


            if (migrationError) {
                throw migrationError;
            }


            supabaseExpenses.push(
                ...(migratedData || [])
            );


            console.log(
                `${expensesToMigrate.length} gasto(s) local(es) migrado(s) a Supabase.`
            );

        }


        // ====================================================
        // SUPABASE ES AHORA LA FUENTE PRINCIPAL
        // ====================================================

        expenses =
            supabaseExpenses.map(
                expense => ({

                    id:
                        expense.id,

                    date:
                        expense.date,

                    description:
                        expense.description,

                    categoryId:
                        expense.category_id,

                    categoryName:
                        expense.category_name,

                    currency:
                        expense.currency,

                    amount:
                        Number(
                            expense.amount
                        ),

                    exchangeRate:
                        Number(
                            expense.exchange_rate
                        ),

                    amountGTQ:
                        Number(
                            expense.amount_gtq
                        ),

                    exchangeRateSource:
                        expense.exchange_rate_source ||
                        "",

                    notes:
                        expense.notes ||
                        "",

                    paymentMethod:
                          expense.payment_method || "cash",

                    creditCardId:
                         expense.credit_card_id || null,

                    statementCutoffDate:
                        expense.statement_cutoff_date || null,

                    statementDueDate:
                        expense.statement_due_date || null,

                    createdAt:
                        expense.created_at,

                    updatedAt:
                        expense.updated_at

                })
            );


        // localStorage queda temporalmente
        // como respaldo.

        saveExpenses();

        renderExpenseTable();


        console.log(
            "Gastos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando gastos con Supabase:",
            error
        );

        // Si Supabase falla, conservamos
        // los datos locales como respaldo.

        renderExpenseTable();

    }

}

// ============================================================
// CATEGORÍAS DE GASTOS
// ============================================================

function populateExpenseCategories() {

    if (!expenseCategory) {
        return;
    }

    const currentValue =
        expenseCategory.value;

    const activeCategories =
        categories.expense.filter(
            category =>
                category.active !== false
        );


    expenseCategory.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "Selecciona una categoría";

    expenseCategory.appendChild(
        defaultOption
    );


    activeCategories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            expenseCategory.appendChild(
                option
            );

        }
    );


    if (
        currentValue &&
        activeCategories.some(
            category =>
                category.id === currentValue
        )
    ) {

        expenseCategory.value =
            currentValue;

    }

}


// ============================================================
// ABRIR FORMULARIO
// ============================================================

function openExpenseForm(
    expense = null
) {

    if (
        !expenseFormPanel ||
        !expenseForm
    ) {

        console.error(
            "No existe el formulario de gastos."
        );

        return;
    }


    expenseFormPanel.hidden = false;


    populateExpenseCategories();


    if (expense) {

        expenseId.value =
            expense.id;

        expenseDate.value =
            expense.date;

        expenseDescription.value =
            expense.description;

        expenseCategory.value =
            expense.categoryId;

        expenseCurrency.value =
            expense.currency;

        expenseAmount.value =
            expense.amount;

        expenseNotes.value =
            expense.notes || "";

        expensePaymentMethod.value =
           expense.paymentMethod || "cash";

expensePaymentMethod.dispatchEvent(
    new Event("change")
);

populateExpenseCreditCardOptions(
    expense.creditCardId || null
);

expenseCreditCardId.value =
    expense.creditCardId || "";


        if (
            expense.currency === "USD"
        ) {

            expenseExchangeGroup.hidden =
                false;

            expenseExchangeRate.value =
                expense.exchangeRate || "";

        } else {

            expenseExchangeGroup.hidden =
                true;

            expenseExchangeRate.value =
                "";

        }


        updateExpenseConversion();


    } else {

        expenseForm.reset();
        expensePaymentMethod.value = "cash";

expensePaymentMethod.dispatchEvent(
    new Event("change")
);


        expenseId.value =
            "";

        expenseDate.value =
            new Date()
                .toISOString()
                .split("T")[0];

        expenseCurrency.value =
            "GTQ";

        expenseExchangeGroup.hidden =
            true;

        expenseExchangeRate.value =
            "";

        expenseAmountGTQ.textContent =
            "Q 0.00";

        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "";

        }

    }


    expenseDate.focus();

}


// ============================================================
// CERRAR FORMULARIO
// ============================================================

function closeExpenseForm() {

    if (!expenseFormPanel) {
        return;
    }

    expenseFormPanel.hidden =
        true;


    if (expenseForm) {
        expenseForm.reset();
    }


    if (expenseId) {
        expenseId.value = "";
    }


    if (expenseExchangeGroup) {

        expenseExchangeGroup.hidden =
            true;

    }


    if (expenseExchangeRate) {

        expenseExchangeRate.value =
            "";

    }


    if (expenseAmountGTQ) {

        expenseAmountGTQ.textContent =
            "Q 0.00";

    }


    if (
        expenseExchangeRateStatus
    ) {

        expenseExchangeRateStatus.textContent =
            "";

    }

}


// ============================================================
// BOTONES DEL FORMULARIO
// ============================================================

if (newExpenseButton) {

    newExpenseButton.addEventListener(
        "click",
        () => openExpenseForm()
    );

}


if (cancelExpenseButton) {

    cancelExpenseButton.addEventListener(
        "click",
        closeExpenseForm
    );

}


// ============================================================
// MONEDA
// ============================================================

function updateExpenseCurrencyUI() {

    if (!expenseCurrency) {
        return;
    }


    const currency =
        expenseCurrency.value;


    if (
        currency === "USD"
    ) {

        expenseExchangeGroup.hidden =
            false;


        if (
            !expenseExchangeRate.value
        ) {

            fetchExpenseExchangeRate();

        }

    } else {

        expenseExchangeGroup.hidden =
            true;

        expenseExchangeRate.value =
            "";

        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "";

        }

    }


    updateExpenseConversion();

}


function updateExpenseConversion() {

    if (!expenseAmountGTQ) {
        return;
    }


    const amount =
        parseFloat(
            expenseAmount?.value
        ) || 0;


    const currency =
        expenseCurrency?.value ||
        "GTQ";


    let amountGTQ = 0;


    if (
        currency === "GTQ"
    ) {

        amountGTQ =
            amount;

    } else {

        const rate =
            parseFloat(
                expenseExchangeRate?.value
            ) || 0;

        amountGTQ =
            amount * rate;

    }


    expenseAmountGTQ.textContent =
        formatCurrency(
            amountGTQ,
            "GTQ"
        );

}


if (expenseCurrency) {

    expenseCurrency.addEventListener(
        "change",
        updateExpenseCurrencyUI
    );

}


if (expenseAmount) {

    expenseAmount.addEventListener(
        "input",
        updateExpenseConversion
    );

}


if (expenseExchangeRate) {

    expenseExchangeRate.addEventListener(
        "input",
        updateExpenseConversion
    );

}


// ============================================================
// TIPO DE CAMBIO
// ============================================================

async function fetchExpenseExchangeRate() {

    if (!expenseExchangeRate) {
        return;
    }


    if (expenseExchangeRateStatus) {

        expenseExchangeRateStatus.textContent =
            "Consultando tipo de cambio...";

    }


    if (refreshExpenseExchangeRate) {

        refreshExpenseExchangeRate.disabled =
            true;

    }


    try {

        const url =
            "https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx/TipoCambioDia";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const text =
            await response.text();


        const parser =
            new DOMParser();


        const xml =
            parser.parseFromString(
                text,
                "text/xml"
            );


        const node =
            xml.querySelector(
                "VarDolar referencia"
            );


        if (!node) {

            throw new Error(
                "No se encontró el tipo de cambio."
            );

        }


        const rate =
            parseFloat(
                node.textContent
            );


        if (
            !rate ||
            rate <= 0
        ) {

            throw new Error(
                "Tipo de cambio inválido."
            );

        }


        expenseExchangeRate.value =
            rate.toFixed(4);


        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "Tipo de cambio obtenido de Banguat.";

        }


        updateExpenseConversion();


    } catch (error) {

        console.warn(
            "No se pudo obtener el tipo de cambio:",
            error
        );


        if (
            expenseExchangeRateStatus
        ) {

            expenseExchangeRateStatus.textContent =
                "No se pudo obtener automáticamente. Puedes ingresarlo manualmente.";

        }


    } finally {

        if (refreshExpenseExchangeRate) {

            refreshExpenseExchangeRate.disabled =
                false;

        }

    }

}


if (refreshExpenseExchangeRate) {

    refreshExpenseExchangeRate.addEventListener(
        "click",
        fetchExpenseExchangeRate
    );

}


// ============================================================
// GUARDAR GASTO
// ============================================================

if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const date =
                expenseDate.value;

            const description =
                expenseDescription.value.trim();

            const categoryId =
                expenseCategory.value;

            const currency =
                expenseCurrency.value;

            const amount =
                parseFloat(
                    expenseAmount.value
                );

            const notes =
                expenseNotes.value.trim();

                const paymentMethod =
    expensePaymentMethod.value;

const creditCardId =
    paymentMethod === "card"
        ? expenseCreditCardId.value
        : null;

if (paymentMethod === "card" && !creditCardId) {
    alert("Selecciona una tarjeta de crédito.");
    return;
}

            if (!date) {

                alert(
                    "Selecciona la fecha."
                );

                return;
            }


            if (!description) {

                alert(
                    "Ingresa una descripción."
                );

                return;
            }


            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Ingresa un monto válido."
                );

                return;
            }


            const category =
                categories.expense.find(
                    item =>
                        item.id === categoryId
                );


            if (!category) {

                alert(
                    "La categoría seleccionada no existe."
                );

                return;
            }

            const selectedCreditCard =
    paymentMethod === "card"
        ? creditCards.find(
            card =>
                card.id === creditCardId &&
                card.active !== false
        )
        : null;

if (paymentMethod === "card" && !selectedCreditCard) {
    alert("La tarjeta seleccionada no está disponible.");
    return;
}

const statementDates =
    selectedCreditCard
        ? getCreditCardStatementDates(date, selectedCreditCard)
        : {
            statementCutoffDate: null,
            statementDueDate: null
        };

            let exchangeRate =
                1;

            let amountGTQ =
                amount;


            if (
                currency === "USD"
            ) {

                exchangeRate =
                    parseFloat(
                        expenseExchangeRate.value
                    );


                if (
                    !exchangeRate ||
                    exchangeRate <= 0
                ) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;
                }


                amountGTQ =
                    amount *
                    exchangeRate;

            }


            const id =
                expenseId.value ||
                createId("expense");


            const existingExpense =
                expenses.find(
                    item =>
                        item.id === id
                );


            const now =
                new Date().toISOString();


            const expenseData = {

                id: id,

                date: date,

                description: description,

                categoryId:
                    category.id,

                categoryName:
                    category.name,

                currency:
                    currency,

                amount:
                    amount,

                exchangeRate:
                    exchangeRate,

                amountGTQ:
                    amountGTQ,

                exchangeRateSource:
                    currency === "USD"
                        ? "Banguat/Manual"
                        : "N/A",

                notes:
                    notes,

                paymentMethod:
                   paymentMethod,

                  creditCardId:
                    creditCardId,

                statementCutoffDate:
                   statementDates.statementCutoffDate,

                statementDueDate:
                   statementDates.statementDueDate,

                createdAt:
                    existingExpense?.createdAt ||
                    now,

                updatedAt:
                    now

            };


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const supabaseData = {

                    id:
                        expenseData.id,

                    user_id:
                        user.id,

                    date:
                        expenseData.date,

                    description:
                        expenseData.description,

                    category_id:
                        expenseData.categoryId,

                    category_name:
                        expenseData.categoryName,

                    currency:
                        expenseData.currency,

                    amount:
                        expenseData.amount,

                    exchange_rate:
                        expenseData.exchangeRate,

                    amount_gtq:
                        expenseData.amountGTQ,

                    exchange_rate_source:
                        expenseData.exchangeRateSource,

                    notes:
                        expenseData.notes,

                    payment_method:
                        expenseData.paymentMethod,

                    credit_card_id:
                        expenseData.creditCardId,

                    statement_cutoff_date:
                        expenseData.statementCutoffDate,

                    statement_due_date:
                        expenseData.statementDueDate,

                    created_at:
                        expenseData.createdAt,

                    updated_at:
                        expenseData.updatedAt

                };


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("gastos")
                    .upsert(
                        supabaseData
                    )
                    .select()
                    .single();


                if (error) {

                    throw error;

                }


                expenses =
                    expenses.filter(
                        item =>
                            item.id !== id
                    );


                expenses.push(
                    expenseData
                );


                saveExpenses();

                renderExpenseTable();

                updateDashboard();

                closeExpenseForm();


                alert(
                    existingExpense
                        ? "Gasto actualizado correctamente."
                        : "Gasto guardado correctamente."
                );


            } catch (error) {

                console.error(
                    "Error guardando gasto en Supabase:",
                    error
                );


                alert(
                    "No se pudo guardar el gasto en Supabase."
                );

            }

        }
    );

}

// ============================================================
// TABLA DE GASTOS
// ============================================================

function renderExpenseTable() {

    if (!expenseTableContainer) {
        return;
    }

renderCreditCardStatements();
renderDashboardCardPayments();

    const selectedMonth = String(
    dashboardMonth?.value ||
    new Date().getMonth() + 1
).padStart(2, "0");

const selectedYear =
    dashboardYear?.value ||
    String(new Date().getFullYear());

const monthlyExpenses = expenses.filter(expense => {
    if (!expense.date) return false;

    const [expenseYear, expenseMonth] =
        expense.date.split("-");

    return (
        expenseYear === selectedYear &&
        expenseMonth === selectedMonth
    );
});

if (monthlyExpenses.length === 0) {
    expenseTableContainer.innerHTML = `
        <div class="empty-table">
            No hay gastos registrados en el mes seleccionado.
        </div>
    `;
    return;
}

const sorted =
    [...monthlyExpenses].sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );


    let html = `

        <table class="data-table">

            <thead>

                <tr>

                    <th>Fecha</th>

                    <th>Descripción</th>

                    <th>Categoría</th>

                    <th>Moneda</th>

                    <th>Monto</th>

                    <th>Equivalente GTQ</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

    `;


    sorted.forEach(
        expense => {

            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        expense.categoryId
                );


            const categoryName =
                category?.name ||
                expense.categoryName ||
                "Categoría eliminada";


                        html += `
                <tr class="expense-main-row">
                    <td>${formatDate(expense.date)}</td>
                    <td>${escapeHtml(expense.description || "")}</td>
                    <td>${escapeHtml(categoryName)}</td>
                    <td>${escapeHtml(expense.currency || "GTQ")}</td>
                    <td class="income-amount">
                        ${formatCurrency(expense.amount, expense.currency)}
                    </td>
                    <td class="income-amount">
                        ${formatCurrency(expense.amountGTQ, "GTQ")}
                    </td>
                    <td>
                        <div class="table-actions">
                            <button
                                type="button"
                                class="table-action-button"
                                data-expense-action="edit"
                                data-expense-id="${expense.id}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="table-action-button delete"
                                data-expense-action="delete"
                                data-expense-id="${expense.id}">
                                Eliminar
                            </button>
                        </div>
                    </td>

                    <td class="expense-mobile-summary-cell" colspan="7">
                        <button
                            type="button"
                            class="expense-mobile-toggle"
                            data-expense-toggle="${expense.id}"
                            aria-expanded="false">
                            <span class="expense-mobile-date">
                                ${formatDate(expense.date)}
                            </span>
                            <span class="expense-mobile-description">
                                ${escapeHtml(expense.description || "Sin descripción")}
                            </span>
                            <span class="expense-mobile-category">
                                ${escapeHtml(categoryName)}
                            </span>
                            <span class="expense-mobile-chevron" aria-hidden="true">⌄</span>
                        </button>
                    </td>
                </tr>

                <tr
                    class="expense-details-row"
                    data-expense-details="${expense.id}"
                    hidden>
                    <td colspan="7">
                                                <div class="expense-details-panel">
                            ${
                                expense.description
                                    ? `
                                        <div class="expense-detail-item full expense-detail-description">
                                            <span>Descripción completa</span>
                                            <strong>${escapeHtml(expense.description)}</strong>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="expense-detail-group">
                                <div class="expense-detail-item">
                                    <span>Moneda y monto</span>
                                    <strong>
                                        ${formatCurrency(expense.amount, expense.currency)}
                                    </strong>
                                </div>

                                <div class="expense-detail-item">
                                    <span>Equivalente en GTQ</span>
                                    <strong>
                                        ${formatCurrency(expense.amountGTQ, "GTQ")}
                                    </strong>
                                </div>
                            </div>

                            ${
                                expense.notes
                                    ? `
                                        <div class="expense-detail-item full expense-detail-notes">
                                            <span>Notas</span>
                                            <strong>${escapeHtml(expense.notes)}</strong>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="expense-details-actions">
                                <button
                                    type="button"
                                    class="table-action-button"
                                    data-expense-action="edit"
                                    data-expense-id="${expense.id}">
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    class="table-action-button delete"
                                    data-expense-action="delete"
                                    data-expense-id="${expense.id}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;

        }
    );


    html += `

            </tbody>

        </table>

    `;


    expenseTableContainer.innerHTML =
        html;

}

expenseTableContainer?.addEventListener("click", event => {
    const toggle = event.target.closest("[data-expense-toggle]");

    if (!toggle || !expenseTableContainer.contains(toggle)) {
        return;
    }

    const expenseId = toggle.dataset.expenseToggle;

    const detailsRows = [
        ...expenseTableContainer.querySelectorAll(".expense-details-row")
    ];

    const selectedDetails = detailsRows.find(
        row => row.dataset.expenseDetails === expenseId
    );

    if (!selectedDetails) return;

    const shouldOpen = selectedDetails.hidden;

    detailsRows.forEach(row => {
        row.hidden = true;
    });

    expenseTableContainer
        .querySelectorAll("[data-expense-toggle]")
        .forEach(button => {
            button.setAttribute("aria-expanded", "false");
        });

    if (shouldOpen) {
        selectedDetails.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
    }
});

function renderCreditCardStatements() {
    if (!creditCardStatementsContainer) {
        return;
    }

    const selectedPeriod =
    `${getDashboardYear()}-${getDashboardMonth()}-`;

const actualCardExpenses = expenses.filter(
    expense =>
        expense.paymentMethod === "card" &&
        expense.creditCardId &&
        expense.statementCutoffDate &&
        expense.statementDueDate &&
        expense.statementDueDate.startsWith(selectedPeriod)
);

const projectedCardExpenses =
    getProjectedFixedCardCharges(selectedPeriod);

const cardExpenses = [
    ...actualCardExpenses,
    ...projectedCardExpenses
];

    if (cardExpenses.length === 0) {
        creditCardStatementsContainer.innerHTML = `
            <div class="empty-table">
                No hay gastos registrados con tarjeta de crédito.
            </div>
        `;
        return;
    }

    const statements = new Map();

    cardExpenses.forEach(expense => {
        const key = [
            expense.creditCardId,
            expense.statementCutoffDate,
            expense.statementDueDate
        ].join("|");

        let statement = statements.get(key);

        if (!statement) {
            statement = {
                creditCardId: expense.creditCardId,
                cutoffDate: expense.statementCutoffDate,
                dueDate: expense.statementDueDate,
                totalGTQ: 0,
                projectedGTQ: 0
            };

            statements.set(key, statement);
        }

        const amountGTQ =
    Number(expense.amountGTQ) || 0;

statement.totalGTQ += amountGTQ;

if (expense.isProjected) {
    statement.projectedGTQ += amountGTQ;
}
    });

    const sortedStatements =
        [...statements.values()].sort(
            (a, b) =>
                a.dueDate.localeCompare(b.dueDate) ||
                a.cutoffDate.localeCompare(b.cutoffDate)
        );

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Tarjeta</th>
                    <th>Fecha de corte</th>
                    <th>Fecha de pago</th>
                    <th>Total a pagar (GTQ)</th>
                    <th>Previsto (GTQ)</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedStatements.forEach(statement => {
        const card = creditCards.find(
            item => item.id === statement.creditCardId
        );

        const cardName = card
            ? `${card.bank} - ${card.name}`
            : "Tarjeta de crédito";

        html += `
            <tr>
                <td>${escapeHtml(cardName)}</td>
                <td>${formatDate(statement.cutoffDate)}</td>
                <td>${formatDate(statement.dueDate)}</td>
                <td class="income-amount">
                    ${formatCurrency(statement.totalGTQ, "GTQ")}</td>
                <td>${formatCurrency(statement.projectedGTQ, "GTQ")}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    creditCardStatementsContainer.innerHTML = html;
}

// ============================================================
// EDITAR / ELIMINAR GASTOS
// ============================================================

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                "[data-expense-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.expenseAction;

        const id =
            button.dataset.expenseId;


        const expense =
            expenses.find(
                item =>
                    item.id === id
            );


        if (!expense) {
            return;
        }


        if (
            action === "edit"
        ) {

            openExpenseForm(
                expense
            );

            return;
        }


        if (
            action === "delete"
        ) {

            const confirmed =
                confirm(
                    `¿Seguro que quieres eliminar el gasto "${expense.description}"?`
                );


            if (!confirmed) {
                return;
            }


            const user =
                await getCurrentUser();


            if (!user) {

                alert(
                    "No hay un usuario autenticado."
                );

                return;
            }


            try {

                const {
                    error
                } = await supabaseClient
                    .from("gastos")
                    .delete()
                    .eq(
                        "id",
                        id
                    );


                if (error) {
                    throw error;
                }


                expenses =
                    expenses.filter(
                        item =>
                            item.id !== id
                    );


                saveExpenses();

renderExpenseTable();

updateDashboard();

            } catch (error) {

                console.error(
                    "Error eliminando gasto de Supabase:",
                    error
                );


                alert(
                    "No se pudo eliminar el gasto de Supabase."
                );

            }

        }

    }
);

// ============================================================
// 14. DASHBOARD
// ============================================================

const dashboardYear =
    document.getElementById("year");

const dashboardMonth =
    document.getElementById("month");

const dashboardIncome =
    document.getElementById("dashboardIncome");

    // Referencias del formulario de tarjetas de crédito
const addCreditCardButton = document.getElementById("addCreditCard");
const creditCardFormPanel = document.getElementById("creditCardFormPanel");
const cancelCreditCardButton = document.getElementById("cancelCreditCardButton");
const creditCardForm = document.getElementById("creditCardForm");
const creditCardsList =
    document.getElementById("creditCardsList");

// Mostrar formulario para agregar una tarjeta
addCreditCardButton?.addEventListener("click", () => {
    creditCardForm.reset();

    document.getElementById("creditCardId").value = "";

    document.getElementById("creditCardFormTitle").textContent =
        "Nueva tarjeta de crédito";

    creditCardFormPanel.hidden = false;
});

// Ocultar formulario de tarjeta
cancelCreditCardButton?.addEventListener("click", () => {
    creditCardFormPanel.hidden = true;
});

// Capturar los datos del formulario de tarjeta
creditCardForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const creditCard = {

            bank:
                document
                    .getElementById("creditCardBank")
                    .value
                    .trim(),

            name:
                document
                    .getElementById("creditCardName")
                    .value
                    .trim(),

            cutoffDay:
                Number(
                    document
                        .getElementById(
                            "creditCardCutoffDay"
                        )
                        .value
                ),

            paymentDay:
                Number(
                    document
                        .getElementById(
                            "creditCardPaymentDay"
                        )
                        .value
                ),

            creditLimit:
                Number(
                    document
                        .getElementById(
                            "creditCardLimit"
                        )
                        .value
                )

        };


        // ----------------------------------------------------
        // VALIDACIONES
        // ----------------------------------------------------

        if (!creditCard.bank) {

            alert(
                "Ingresa el banco de la tarjeta."
            );

            return;

        }


        if (!creditCard.name) {

            alert(
                "Ingresa el nombre de la tarjeta."
            );

            return;

        }


        if (
            creditCard.cutoffDay < 1 ||
            creditCard.cutoffDay > 31
        ) {

            alert(
                "El día de corte debe estar entre 1 y 31."
            );

            return;

        }


        if (
            creditCard.paymentDay < 1 ||
            creditCard.paymentDay > 31
        ) {

            alert(
                "El día límite de pago debe estar entre 1 y 31."
            );

            return;

        }


        if (creditCard.creditLimit < 0) {

            alert(
                "El límite de crédito no puede ser negativo."
            );

            return;

        }


        // ----------------------------------------------------
        // OBTENER USUARIO ACTUAL
        // ----------------------------------------------------

        const user =
            await getCurrentUser();


        if (!user) {

            alert(
                "No hay un usuario autenticado."
            );

            return;

        }


        // ----------------------------------------------------
        // GUARDAR O ACTUALIZAR EN SUPABASE
        // ----------------------------------------------------

        const editingId =
            document.getElementById("creditCardId").value;

        const cardData = {
            bank: creditCard.bank,
            name: creditCard.name,
            cutoff_day: creditCard.cutoffDay,
            payment_day: creditCard.paymentDay,
            credit_limit: creditCard.creditLimit
        };

        let saveQuery =
            supabaseClient
                .from("tarjetas_credito");

        if (editingId) {
            saveQuery = saveQuery
                .update(cardData)
                .eq("id", editingId);
        } else {
            saveQuery = saveQuery
                .insert({
                    user_id: user.id,
                    ...cardData
                });
        }

        const { data, error } =
    await saveQuery
        .select(
            "id, bank, name, cutoff_day, payment_day, credit_limit, active"
        )
        .single();

        if (error) {
            console.error(
                "Error guardando tarjeta:",
                error
            );

            alert(
                "No fue posible guardar la tarjeta."
            );

            return;
        }

        if (editingId) {
            creditCards = creditCards.map(card =>
                card.id === data.id ? data : card
            );
        } else {
            creditCards.push(data);
        }

        renderCreditCards();
        populateExpenseCreditCardOptions();
        populateFixedExpenseCreditCardOptions();

        alert(
            editingId
                ? "Tarjeta actualizada correctamente."
                : "Tarjeta guardada correctamente."
        );


        // ----------------------------------------------------
        // LIMPIAR Y CERRAR FORMULARIO
        // ----------------------------------------------------

        creditCardForm.reset();

        creditCardFormPanel.hidden = true;

    }
);

// ============================================================
// TARJETAS DE CRÉDITO - CARGAR DESDE SUPABASE
// ============================================================

let creditCards = [];

function populateExpenseCreditCardOptions(selectedCardId = null) {
    if (!expenseCreditCardId) return;

    const availableCards = creditCards.filter(
        card =>
            card.active !== false ||
            card.id === selectedCardId
    );

    expenseCreditCardId.innerHTML =
        '<option value="">Selecciona una tarjeta</option>';

    availableCards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = `${card.bank} - ${card.name}`;
        expenseCreditCardId.appendChild(option);
    });
}

function populateFixedExpenseCreditCardOptions(selectedCardId = null) {
    if (!fixedExpenseCreditCardId) return;

    const availableCards = creditCards.filter(
        card =>
            card.active !== false ||
            card.id === selectedCardId
    );

    fixedExpenseCreditCardId.innerHTML =
        '<option value="">Selecciona una tarjeta</option>';

    availableCards.forEach(card => {
        const option = document.createElement("option");
        option.value = card.id;
        option.textContent = `${card.bank} - ${card.name}`;
        fixedExpenseCreditCardId.appendChild(option);
    });

    fixedExpenseCreditCardId.value =
        selectedCardId || "";
}

function getCreditCardStatementDates(expenseDate, card) {
    const [yearValue, monthValue, dayValue] =
        expenseDate.split("-").map(Number);

    const cutoffDay = Number(card.cutoff_day);
    const paymentDay = Number(card.payment_day);

    let cutoffYear = yearValue;
    let cutoffMonth = monthValue;

    // Si la compra fue después del corte, pasa al corte del mes siguiente.
    if (dayValue > cutoffDay) {
        cutoffMonth += 1;

        if (cutoffMonth > 12) {
            cutoffMonth = 1;
            cutoffYear += 1;
        }
    }

    const formatDate = (year, month, day) => {
        const lastDay = new Date(
            Date.UTC(year, month, 0)
        ).getUTCDate();

        const validDay = Math.min(day, lastDay);

        return [
            year,
            String(month).padStart(2, "0"),
            String(validDay).padStart(2, "0")
        ].join("-");
    };

    let dueYear = cutoffYear;
    let dueMonth = cutoffMonth;

    // Si el día de pago es anterior o igual al día de corte,
    // el pago corresponde al mes siguiente.
    if (paymentDay <= cutoffDay) {
        dueMonth += 1;

        if (dueMonth > 12) {
            dueMonth = 1;
            dueYear += 1;
        }
    }

    return {
        statementCutoffDate:
            formatDate(cutoffYear, cutoffMonth, cutoffDay),

        statementDueDate:
            formatDate(dueYear, dueMonth, paymentDay)
    };
}

async function initializeCreditCards() {

    if (!creditCardsList) {
        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar tarjetas."
        );

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("tarjetas_credito")
            .select(`
                id,
                bank,
                name,
                cutoff_day,
                payment_day,
                credit_limit,
                active,
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        creditCards =
            data || [];

            populateExpenseCreditCardOptions();
            populateFixedExpenseCreditCardOptions();
            renderCreditCards();


    } catch (error) {

        console.error(
            "Error cargando tarjetas de crédito:",
            error
        );

        creditCardsList.innerHTML = `
            <p>
                No fue posible cargar las tarjetas.
            </p>
        `;

    }

}


// ============================================================
// MOSTRAR TARJETAS DE CRÉDITO
// ============================================================

let showInactiveCreditCards = false;

function renderCreditCards() {

    if (!creditCardsList) {
        return;
    }

    const activeCards =
        creditCards.filter(
            card => card.active !== false
        );

    const inactiveCards =
        creditCards.filter(
            card => card.active === false
        );

    const visibleCards =
        showInactiveCreditCards
            ? creditCards
            : activeCards;

    let html = "";

    html += `
        <div class="category-list-header">

            <span>
                ${activeCards.length} activa(s)

                ${
                    inactiveCards.length
                        ? ` · ${inactiveCards.length} inactiva(s)`
                        : ""
                }
            </span>

            ${
                inactiveCards.length
                    ? `
                        <button
                            type="button"
                            class="category-filter-button"
                            data-credit-card-filter
                        >
                            ${
                                showInactiveCreditCards
                                    ? "Ocultar inactivas"
                                    : `Mostrar inactivas (${inactiveCards.length})`
                            }
                        </button>
                    `
                    : ""
            }

        </div>
    `;

    if (visibleCards.length === 0) {

        html += `
            <div class="category-empty">
                No hay tarjetas.
            </div>
        `;

        creditCardsList.innerHTML = html;

        return;
    }

    html += `
        <div class="credit-card-list">
    `;

    visibleCards.forEach(card => {

        html += `

            <div
                class="
                    credit-card-item
                    ${
                        card.active === false
                            ? "inactive-category"
                            : ""
                    }
                "
            >

                <div class="credit-card-main">

                    <div class="category-info">

                        <span
                            class="
                                category-status
                                ${
                                    card.active === false
                                        ? "inactive"
                                        : ""
                                }
                            "
                        ></span>

                        <div class="credit-card-title">

                            <strong>
                                ${escapeHtml(card.bank)}
                            </strong>

                            <span>
                                ${escapeHtml(card.name)}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="credit-card-details">

                    <div class="credit-card-detail">

                        <span>
                            Límite de crédito
                        </span>

                        <strong>
                            ${formatCurrency(
                                card.credit_limit,
                                "GTQ"
                            )}
                        </strong>

                    </div>

                    <div class="credit-card-detail">

                        <span>
                            Día de corte
                        </span>

                        <strong>
                            ${card.cutoff_day}
                        </strong>

                    </div>

                    <div class="credit-card-detail">

                        <span>
                            Día de pago
                        </span>

                        <strong>
                            ${card.payment_day}
                        </strong>

                    </div>

                </div>

                <div class="category-actions">

                    <button
                        type="button"
                        class="category-button"
                        data-credit-card-action="edit"
                        data-credit-card-id="${card.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="category-button"
                        data-credit-card-action="toggle"
                        data-credit-card-id="${card.id}"
                    >
                        ${
                            card.active === false
                                ? "Activar"
                                : "Desactivar"
                        }
                    </button>

                    <button
                        type="button"
                        class="category-button delete"
                        data-credit-card-action="delete"
                        data-credit-card-id="${card.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;

    });

    html += `
        </div>
    `;

    creditCardsList.innerHTML = html;
}

function editCreditCard(id) {
    const card = creditCards.find(item => item.id === id);

    if (!card) {
        return;
    }

    document.getElementById("creditCardId").value = card.id;
    document.getElementById("creditCardBank").value = card.bank;
    document.getElementById("creditCardName").value = card.name;
    document.getElementById("creditCardCutoffDay").value = card.cutoff_day;
    document.getElementById("creditCardPaymentDay").value = card.payment_day;
    document.getElementById("creditCardLimit").value = card.credit_limit;

    document.getElementById("creditCardFormTitle").textContent =
        "Editar tarjeta de crédito";

    creditCardFormPanel.hidden = false;
}

async function toggleCreditCard(id) {

    const card =
        creditCards.find(
            item => item.id === id
        );

    if (!card) {
        return;
    }

    const newActive =
        card.active === false;

    const {
        error
    } = await supabaseClient
        .from("tarjetas_credito")
        .update({
            active: newActive,
            updated_at:
                new Date().toISOString()
        })
        .eq("id", id);

    if (error) {

        console.error(
            "Error cambiando estado de tarjeta:",
            error
        );

        alert(
            "No se pudo cambiar el estado de la tarjeta."
        );

        return;
    }

    card.active =
        newActive;

    renderCreditCards();
    populateExpenseCreditCardOptions();
    populateFixedExpenseCreditCardOptions();
}


async function deleteCreditCard(id) {

    const card =
        creditCards.find(
            item => item.id === id
        );

    if (!card) {
        return;
    }

    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar la tarjeta "${card.bank} - ${card.name}"?`
        );

    if (!confirmed) {
        return;
    }

    const {
        data: deletedRows,
        error
    } = await supabaseClient
        .from("tarjetas_credito")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {

        console.error(
            "Error eliminando tarjeta:",
            error
        );

        alert(
            "No se pudo eliminar la tarjeta."
        );

        return;
    }

    if (
        !deletedRows ||
        deletedRows.length === 0
    ) {

        alert(
            "Supabase no eliminó la tarjeta. Revisa las políticas RLS de DELETE."
        );

        return;
    }

    creditCards =
        creditCards.filter(
            item => item.id !== id
        );

    renderCreditCards();
    populateExpenseCreditCardOptions();
    populateFixedExpenseCreditCardOptions();
}

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-credit-card-action]"
            );

        if (button) {

            const action =
                button.dataset.creditCardAction;

            const id =
                button.dataset.creditCardId;

            if (action === "toggle") {

                toggleCreditCard(id);

            }

            if (action === "delete") {

                deleteCreditCard(id);

            }

            if (action === "edit") {

                editCreditCard(id);

            }

            return;
        }

        const filterButton =
            event.target.closest(
                "[data-credit-card-filter]"
            );

        if (filterButton) {

            showInactiveCreditCards =
                !showInactiveCreditCards;

            renderCreditCards();

        }

    }
);

const dashboardExpenses =
    document.getElementById("dashboardExpenses");

const dashboardFixed =
    document.getElementById("dashboardFixed");

const dashboardBalance =
    document.getElementById("dashboardBalance");

    const dashboardCardPayments =
    document.getElementById("dashboardCardPayments");

const monthlyFlowChart =
    document.getElementById("monthlyFlowChart");

const expenseCategoryChart =
    document.getElementById("expenseCategoryChart");

    // ------------------------------------------------------------
// AÑOS DISPONIBLES
// ------------------------------------------------------------

function populateYearSelectors() {

        if (dashboardMonth) {
        dashboardMonth.value =
            String(new Date().getMonth() + 1).padStart(2, "0");
    }

    const yearSelectors = [
        document.getElementById("year"),
        document.getElementById("reportYear")
    ].filter(Boolean);


    const currentYear =
        new Date().getFullYear();


    const years = new Set();

    // Año actual
    years.add(currentYear);

    // Próximo año
    // Permite preparar el sistema para el siguiente año.
    years.add(currentYear + 1);


    // --------------------------------------------------------
    // AÑOS DE LOS INGRESOS
    // --------------------------------------------------------

    incomes.forEach(income => {

        if (!income.date) {
            return;
        }

        const year =
            Number(
                String(income.date).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // AÑOS DE LOS GASTOS
    // --------------------------------------------------------

    const storedExpenses =
        JSON.parse(
            localStorage.getItem("finanzasGastos")
        ) || [];


    storedExpenses.forEach(expense => {

        if (!expense.date) {
            return;
        }

        const year =
            Number(
                String(expense.date).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // AÑOS DE LOS PRESUPUESTOS
    // --------------------------------------------------------

    const storedBudgets =
        JSON.parse(
            localStorage.getItem(
                "finanzasPresupuestos"
            )
        ) || [];


    storedBudgets.forEach(budget => {

        if (!budget.month) {
            return;
        }

        const year =
            Number(
                String(budget.month).substring(0, 4)
            );

        if (year) {
            years.add(year);
        }

    });


    // --------------------------------------------------------
    // ORDENAR DE MÁS RECIENTE A MÁS ANTIGUO
    // --------------------------------------------------------

    const sortedYears =
        Array.from(years)
            .filter(year => !isNaN(year))
            .sort((a, b) => b - a);


    // --------------------------------------------------------
    // CONSTRUIR SELECTORES
    // --------------------------------------------------------

    yearSelectors.forEach(select => {

        const currentValue =
            select.value;


        select.innerHTML = "";


        sortedYears.forEach(year => {

            const option =
                document.createElement("option");

            option.value = year;
            option.textContent = year;

            select.appendChild(option);

        });


        // Intentar conservar el año
        // que estaba seleccionado.

        if (
            sortedYears.includes(
                Number(currentValue)
            )
        ) {

            select.value =
                currentValue;

        } else {

            select.value =
                String(currentYear);

        }

    });

}


// ------------------------------------------------------------
// OBTENER AÑO SELECCIONADO
// ------------------------------------------------------------

function getDashboardYear() {

    return Number(
        dashboardYear?.value ||
        new Date().getFullYear()
    );

}

// ------------------------------------------------------------
// OBTENER MES SELECCIONADO DEL DASHBOARD
// ------------------------------------------------------------

function getDashboardMonth() {
    return String(
        dashboardMonth?.value ||
        new Date().getMonth() + 1
    ).padStart(2, "0");
}


// ------------------------------------------------------------
// VERIFICAR SI UNA FECHA PERTENECE AL AÑO
// ------------------------------------------------------------

function belongsToYear(
    date,
    year
) {

    if (!date) {
        return false;
    }


    return String(date).startsWith(
        String(year)
    );

}


// ------------------------------------------------------------
// CALCULAR INGRESOS DEL AÑO
// ------------------------------------------------------------

function getDashboardIncome(
    year
) {

    return incomes.reduce(
        (total, income) => {

            if (
                !belongsToYear(
                    income.date,
                    year
                )
            ) {
                return total;
            }


            const amount =
                parseFloat(
                    income.amountGTQ
                ) || 0;


            return total + amount;

        },
        0
    );

}


// ------------------------------------------------------------
// CALCULAR GASTOS DEL AÑO
// ------------------------------------------------------------

function getDashboardExpenses(
    year
) {

    const storedExpenses =
        JSON.parse(
            localStorage.getItem(
                "finanzasGastos"
            )
        ) || [];


    return storedExpenses.reduce(
        (total, expense) => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return total;
            }


            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            return total + amount;

        },
        0
    );

}

// ------------------------------------------------------------
// CALCULAR GASTOS FIJOS DEL MES SELECCIONADO
// ------------------------------------------------------------

function getDashboardFixedExpenses(
    year,
    month
) {

    const selectedDate =
        new Date(
            Number(year),
            Number(month) - 1,
            1
        );

        const storedFixedExpenses =
    JSON.parse(
        localStorage.getItem(
            "finanzasGastosFijos"
        )
    ) || [];


    return storedFixedExpenses.reduce(
        (total, expense) => {

            if (
                expense.active === false
            ) {
                return total;
            }


            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            // CUOTAS

            if (
                expense.expenseType ===
                    "installment"
            ) {

                const progress =
                    getFixedExpenseInstallmentProgressForMonth(
                        expense,
                        selectedDate
                    );


                if (!progress) {
                    return total;
                }


                return total + getFixedExpenseMonthlyAmount(expense);

            }


            // GASTOS RECURRENTES

            switch (
                expense.frequency
            ) {

                case "weekly":
                    return total +
                        (
                            amount *
                            52 /
                            12
                        );

                case "biweekly":
                    return total +
                        (
                            amount *
                            26 /
                            12
                        );

                case "yearly":
                    return total +
                        (
                            amount /
                            12
                        );

                case "monthly":
                default:
                    return total +
                        amount;

            }

        },
        0
    );

}

// ------------------------------------------------------------
// ACTUALIZAR TARJETAS DEL DASHBOARD
// ------------------------------------------------------------

function updateDashboardCards() {

    const year =
        getDashboardYear();

    const month =
        getDashboardMonth();

    const selectedPeriod =
        `${year}-${month}`;


    // --------------------------------------------------------
    // VARIABLES PRINCIPALES DEL DASHBOARD
    // --------------------------------------------------------

    let totalIncome = 0;

    let totalExpenses = 0;

    let monthlyFixedExpenses = 0;


    // --------------------------------------------------------
    // INGRESOS DEL MES SELECCIONADO
    // --------------------------------------------------------
            const sumForSelectedPeriod = records =>
    records.reduce((total, record) => {
        const recordPeriod =
            String(record.date || "").slice(0, 7);

        if (recordPeriod !== selectedPeriod) {
            return total;
        }

        return total +
            (Number(record.amountGTQ) || 0);
    }, 0);

totalIncome = sumForSelectedPeriod(incomes);
totalExpenses = sumForSelectedPeriod(expenses);
    // --------------------------------------------------------
    // GASTOS FIJOS DEL MES SELECCIONADO
    // --------------------------------------------------------

    monthlyFixedExpenses =
        getDashboardFixedExpenses(
            year,
            month
        );


    // --------------------------------------------------------
    // DISPONIBLE
    // --------------------------------------------------------

    const balance =
        totalIncome -
        totalExpenses -
        monthlyFixedExpenses;


    // --------------------------------------------------------
    // MOSTRAR INGRESOS
    // --------------------------------------------------------

    if (dashboardIncome) {

        dashboardIncome.textContent =
            formatCurrency(
                totalIncome,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR GASTOS
    // --------------------------------------------------------

    if (dashboardExpenses) {

        dashboardExpenses.textContent =
            formatCurrency(
                totalExpenses,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR GASTOS FIJOS
    // --------------------------------------------------------

    if (dashboardFixed) {

        dashboardFixed.textContent =
            formatCurrency(
                monthlyFixedExpenses,
                "GTQ"
            );

    }


    // --------------------------------------------------------
    // MOSTRAR DISPONIBLE
    // --------------------------------------------------------

    if (dashboardBalance) {

        dashboardBalance.textContent =
            formatCurrency(
                balance,
                "GTQ"
            );

    }

}

// ------------------------------------------------------------
// DATOS MENSUALES
// ------------------------------------------------------------

function getMonthlyDashboardData(
    year
) {

    const storedExpenses =
        JSON.parse(
            localStorage.getItem(
                "finanzasGastos"
            )
        ) || [];


    const months =
        Array.from(
            { length: 12 },
            () => ({
                income: 0,
                expense: 0
            })
        );


    incomes.forEach(
        income => {

            if (
                !belongsToYear(
                    income.date,
                    year
                )
            ) {
                return;
            }


            const month =
                Number(
                    income.date.substring(
                        5,
                        7
                    )
                ) - 1;


            if (
                month >= 0 &&
                month < 12
            ) {

                months[month].income +=
                    parseFloat(
                        income.amountGTQ
                    ) || 0;

            }

        }
    );


    storedExpenses.forEach(
        expense => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return;
            }


            const month =
                Number(
                    expense.date.substring(
                        5,
                        7
                    )
                ) - 1;


            if (
                month >= 0 &&
                month < 12
            ) {

                months[month].expense +=
                    parseFloat(
                        expense.amountGTQ
                    ) || 0;

            }

        }
    );


    return months;

}


// ------------------------------------------------------------
// RENDERIZAR FLUJO MENSUAL
// ------------------------------------------------------------

function renderMonthlyFlowChart() {

    if (!monthlyFlowChart) {
        return;
    }


    const year =
        getDashboardYear();


    const months =
        getMonthlyDashboardData(
            year
        );


    const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
    ];


    const maxValue =
        Math.max(
            ...months.flatMap(
                month => [
                    month.income,
                    month.expense
                ]
            ),
            0
        );


    if (maxValue === 0) {

        monthlyFlowChart.innerHTML = `
            <div class="dashboard-empty">
                Todavía no hay movimientos registrados
                para ${year}.
            </div>
        `;

        return;

    }


    let html = "";


    months.forEach(
        (month, index) => {

            const incomeHeight =
                maxValue > 0
                    ? (month.income / maxValue) * 100
                    : 0;


            const expenseHeight =
                maxValue > 0
                    ? (month.expense / maxValue) * 100
                    : 0;


            html += `

                <div
                    class="month-chart-item"
                    title="${monthNames[index]} ${year}"
                >

                    <div class="month-bars">

                        <div
                            class="month-bar income"
                            style="height: ${Math.max(incomeHeight, 1)}%"
                            title="Ingresos: ${formatCurrency(month.income, "GTQ")}"
                        ></div>


                        <div
                            class="month-bar expense"
                            style="height: ${Math.max(expenseHeight, 1)}%"
                            title="Gastos: ${formatCurrency(month.expense, "GTQ")}"
                        ></div>

                    </div>


                    <span class="month-label">

                        ${monthNames[index]}

                    </span>

                </div>

            `;

        }
    );


    monthlyFlowChart.innerHTML = `

        ${html}

        <div class="chart-legend">

            <div class="legend-item">

                <span
                    class="legend-dot income"
                ></span>

                Ingresos

            </div>


            <div class="legend-item">

                <span
                    class="legend-dot expense"
                ></span>

                Gastos

            </div>

        </div>

    `;

}


// ------------------------------------------------------------
// GASTOS POR CATEGORÍA
// ------------------------------------------------------------

function getExpenseCategoryData(
    year
) {

    const storedExpenses =
        JSON.parse(
            localStorage.getItem(
                "finanzasGastos"
            )
        ) || [];


    const totals = {};


    storedExpenses.forEach(
        expense => {

            if (
                !belongsToYear(
                    expense.date,
                    year
                )
            ) {
                return;
            }


            const categoryId =
                expense.categoryId;


            const category =
                categories.expense.find(
                    item =>
                        item.id ===
                        categoryId
                );


            const categoryName =
                category?.name ||
                expense.categoryName ||
                "Categoría eliminada";


            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;


            if (!totals[categoryId]) {

                totals[categoryId] = {
                    name:
                        categoryName,
                    amount: 0
                };

            }


            totals[categoryId].amount +=
                amount;

        }
    );


    return Object.values(
        totals
    ).sort(
        (a, b) =>
            b.amount -
            a.amount
    );

}


// ------------------------------------------------------------
// RENDERIZAR GASTOS POR CATEGORÍA
// ------------------------------------------------------------

function renderExpenseCategoryChart() {

    if (!expenseCategoryChart) {
        return;
    }


    const year =
        getDashboardYear();


    const categoryData =
        getExpenseCategoryData(
            year
        );


    if (
        categoryData.length === 0
    ) {

        expenseCategoryChart.innerHTML = `
            <div class="dashboard-empty">
                No hay gastos registrados
                para ${year}.
            </div>
        `;

        return;

    }


    const maxAmount =
        Math.max(
            ...categoryData.map(
                item =>
                    item.amount
            ),
            0
        );


    let html = "";


    categoryData.forEach(
        item => {

            const percentage =
                maxAmount > 0
                    ? (item.amount / maxAmount) * 100
                    : 0;


            html += `

                <div
                    class="category-chart-row"
                >

                    <div
                        class="category-chart-name"
                        title="${escapeHtml(item.name)}"
                    >

                        ${escapeHtml(
                            item.name
                        )}

                    </div>


                    <div
                        class="category-chart-bar-container"
                    >

                        <div
                            class="category-chart-bar"
                            style="
                                width: ${percentage}%;
                                background: #6366f1;
                            "
                        ></div>

                    </div>


                    <div
                        class="category-chart-amount"
                    >

                        ${formatCurrency(
                            item.amount,
                            "GTQ"
                        )}

                    </div>

                </div>

            `;

        }
    );


    expenseCategoryChart.innerHTML =
        html;

}


// ------------------------------------------------------------
// ACTUALIZAR TODO EL DASHBOARD
// ------------------------------------------------------------

function updateDashboard() {
    updateDashboardCards();
    renderMonthlyFlowChart();
    renderExpenseCategoryChart();
    renderDashboardCardPayments();
    renderCreditCardStatements();
}

function getProjectedFixedCardCharges(selectedPeriod) {
    const selectedYear =
        Number(selectedPeriod.slice(0, 4));

    const selectedMonthIndex =
        Number(selectedPeriod.slice(5, 7)) - 1;

    const selectedMonthDate =
        new Date(selectedYear, selectedMonthIndex, 1);

    const projectedCharges = [];

    const formatDate = (year, monthIndex, day) => {
        const lastDay =
            new Date(year, monthIndex + 1, 0).getDate();

        const validDay =
            Math.min(Number(day), lastDay);

        return [
            year,
            String(monthIndex + 1).padStart(2, "0"),
            String(validDay).padStart(2, "0")
        ].join("-");
    };

    fixedExpenses.forEach(expense => {
        if (
            expense.active === false ||
            expense.paymentMethod !== "card" ||
            !expense.creditCardId
        ) {
            return;
        }

        const card = creditCards.find(
            item =>
                String(item.id) ===
                String(expense.creditCardId)
        );

        if (!card) {
            return;
        }

        // Las cuotas se agregan solo durante los meses que corresponden.
        if (expense.expenseType === "installment") {
            const progress =
                getFixedExpenseInstallmentProgressForMonth(
                    expense,
                    selectedMonthDate
                );

            if (!progress) {
                return;
            }

            const alreadyRegistered = expenses.some(
                registeredExpense =>
                    registeredExpense.paymentMethod === "card" &&
                    String(registeredExpense.creditCardId) ===
                        String(expense.creditCardId) &&
                    registeredExpense.statementDueDate &&
                    registeredExpense.statementDueDate.startsWith(
                        selectedPeriod
                    ) &&
                    String(registeredExpense.description || "")
                        .trim()
                        .toLowerCase() ===
                    String(expense.name || "")
                        .trim()
                        .toLowerCase()
            );

            if (alreadyRegistered) {
                return;
            }

            const installmentAmountGTQ =
                Number(expense.amountGTQ) /
                Number(expense.totalInstallments);

            const cardCutoffDay =
    Number(card.cutoff_day || expense.cutoffDay);

const cardPaymentDay =
    Number(card.payment_day || expense.dueDay);

const cutoffMonthDate =
    new Date(selectedYear, selectedMonthIndex - 1, 1);

projectedCharges.push({
    creditCardId: expense.creditCardId,
    statementCutoffDate: formatDate(
        cutoffMonthDate.getFullYear(),
        cutoffMonthDate.getMonth(),
        cardCutoffDay
    ),
    statementDueDate: formatDate(
        selectedYear,
        selectedMonthIndex,
        cardPaymentDay
    ),
    amountGTQ: installmentAmountGTQ,
    isProjected: true
});

            return;
        }

        // Los cargos recurrentes mensuales conservan su cálculo actual.
        if (
            expense.expenseType !== "recurring" ||
            expense.frequency !== "monthly" ||
            !expense.chargeDay
        ) {
            return;
        }

        for (let monthsBack = 0; monthsBack <= 2; monthsBack++) {
            const occurrenceMonth = new Date(
                selectedYear,
                selectedMonthIndex - monthsBack,
                1
            );

            const year =
                occurrenceMonth.getFullYear();

            const monthIndex =
                occurrenceMonth.getMonth();

            const lastDayOfMonth =
                new Date(year, monthIndex + 1, 0).getDate();

            const chargeDay =
                Math.min(
                    Number(expense.chargeDay),
                    lastDayOfMonth
                );

            const chargeDate = [
                year,
                String(monthIndex + 1).padStart(2, "0"),
                String(chargeDay).padStart(2, "0")
            ].join("-");

            const statementDates =
                getCreditCardStatementDates(chargeDate, card);

            if (
                !statementDates.statementDueDate.startsWith(
                    selectedPeriod
                )
            ) {
                continue;
            }

            const alreadyRegistered = expenses.some(
                registeredExpense =>
                    registeredExpense.paymentMethod === "card" &&
                    String(registeredExpense.creditCardId) ===
                        String(expense.creditCardId) &&
                    registeredExpense.date === chargeDate &&
                    String(registeredExpense.description || "")
                        .trim()
                        .toLowerCase() ===
                    String(expense.name || "")
                        .trim()
                        .toLowerCase()
            );

            if (alreadyRegistered) {
                continue;
            }

            const amountGTQ =
                Number(expense.amountGTQ) ||
                Number(expense.amount) *
                    Number(expense.exchangeRate || 1);

            projectedCharges.push({
                creditCardId: expense.creditCardId,
                statementCutoffDate:
                    statementDates.statementCutoffDate,
                statementDueDate:
                    statementDates.statementDueDate,
                amountGTQ,
                isProjected: true
            });
        }
    });

    return projectedCharges;
}

function renderDashboardCardPayments() {
    if (!dashboardCardPayments) {
        return;
    }

    const selectedPeriod =
        `${getDashboardYear()}-${getDashboardMonth()}-`;

    const actualDueExpenses = expenses.filter(
    expense =>
        expense.paymentMethod === "card" &&
        expense.creditCardId &&
        expense.statementCutoffDate &&
        expense.statementDueDate &&
        expense.statementDueDate.startsWith(selectedPeriod)
);

const projectedDueExpenses =
    getProjectedFixedCardCharges(selectedPeriod);

const dueExpenses = [
    ...actualDueExpenses,
    ...projectedDueExpenses
];

    if (dueExpenses.length === 0) {
        dashboardCardPayments.innerHTML = `
            <div class="empty-table">
                No hay pagos de tarjetas programados para este mes.
            </div>
        `;
        return;
    }

    const payments = new Map();

    dueExpenses.forEach(expense => {
        const key = [
            expense.creditCardId,
            expense.statementCutoffDate,
            expense.statementDueDate
        ].join("|");

        let payment = payments.get(key);

        if (!payment) {
            payment = {
    creditCardId: expense.creditCardId,
    cutoffDate: expense.statementCutoffDate,
    dueDate: expense.statementDueDate,
    totalGTQ: 0,
    projectedGTQ: 0
};

            payments.set(key, payment);
        }

        const amountGTQ =
    Number(expense.amountGTQ) || 0;

payment.totalGTQ += amountGTQ;

if (expense.isProjected) {
    payment.projectedGTQ += amountGTQ;
}
    });

    const monthlyPayments =
        [...payments.values()].sort(
            (a, b) => a.dueDate.localeCompare(b.dueDate)
        );

    const totalDue = monthlyPayments.reduce(
        (total, payment) => total + payment.totalGTQ,
        0
    );

    let html = `
        <div class="dashboard-payment-summary">
    <span>Total estimado a pagar este mes</span>
    <strong>${formatCurrency(totalDue, "GTQ")}</strong>
</div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>Tarjeta</th>
                    <th>Fecha de corte</th>
                    <th>Fecha de pago</th>
                    <th>Monto total (GTQ)</th>
                    <th>Previsto (GTQ)</th>
                </tr>
            </thead>
            <tbody>
    `;

    monthlyPayments.forEach(payment => {
        const card = creditCards.find(
            item => item.id === payment.creditCardId
        );

        const cardName = card
            ? `${card.bank} - ${card.name}`
            : "Tarjeta de crédito";

        html += `
            <tr>
                <td>${escapeHtml(cardName)}</td>
                <td>${formatDate(payment.cutoffDate)}</td>
                <td>${formatDate(payment.dueDate)}</td>
                <td class="income-amount">
                   ${formatCurrency(payment.totalGTQ, "GTQ")}
                           </td>
                     <td>
    ${formatCurrency(payment.projectedGTQ, "GTQ")}
</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    dashboardCardPayments.innerHTML = html;
}


// ------------------------------------------------------------
// ACTUALIZAR DASHBOARD AL CAMBIAR EL AÑO
// ------------------------------------------------------------

if (dashboardYear) {
    dashboardYear.addEventListener(
        "change",
        () => {
            updateDashboard();
            renderIncomeTable();
            renderExpenseTable();
        }
    );
}


// ------------------------------------------------------------
// ACTUALIZAR DASHBOARD AL CAMBIAR EL MES
// ------------------------------------------------------------

if (dashboardMonth) {
    dashboardMonth.addEventListener(
        "change",
        () => {
            updateDashboard();
            renderIncomeTable();
            renderExpenseTable();
        }
    );
}


// ------------------------------------------------------------
// INICIALIZAR AÑOS
// ------------------------------------------------------------

populateYearSelectors();

// ============================================================
// 13. GASTOS FIJOS
// ============================================================

let fixedExpenses =
    JSON.parse(
        localStorage.getItem("finanzasGastosFijos")
    ) || [];

// ------------------------------------------------------------
// INICIALIZAR DASHBOARD
// ------------------------------------------------------------

updateDashboard();


const newFixedExpenseButton =
    document.getElementById("newFixedExpenseButton");

const fixedExpenseFormPanel =
    document.getElementById("fixedExpenseFormPanel");

const fixedExpenseForm =
    document.getElementById("fixedExpenseForm");

const fixedExpenseId =
    document.getElementById("fixedExpenseId");

const fixedExpenseName =
    document.getElementById("fixedExpenseName");

const fixedExpenseCategory =
    document.getElementById("fixedExpenseCategory");

const fixedExpenseCurrency =
    document.getElementById("fixedExpenseCurrency");

const fixedExpenseAmount =
    document.getElementById("fixedExpenseAmount");

const fixedExpensePaymentMethod =
    document.getElementById("fixedExpensePaymentMethod");

const fixedExpenseCreditCardGroup =
    document.getElementById("fixedExpenseCreditCardGroup");

const fixedExpenseCreditCardId =
    document.getElementById("fixedExpenseCreditCardId");

const fixedExpenseChargeDayGroup =
    document.getElementById("fixedExpenseChargeDayGroup");

const fixedExpenseChargeDay =
    document.getElementById("fixedExpenseChargeDay");

const fixedExpenseExchangeGroup =
    document.getElementById("fixedExpenseExchangeGroup");

const fixedExpenseExchangeRate =
    document.getElementById("fixedExpenseExchangeRate");

const refreshFixedExpenseExchangeRate =
    document.getElementById(
        "refreshFixedExpenseExchangeRate"
    );

const fixedExpenseExchangeStatus =
    document.getElementById(
        "fixedExpenseExchangeStatus"
    );

const fixedExpenseType =
    document.getElementById(
        "fixedExpenseType"
    );

const installmentFields =
    document.getElementById(
        "installmentFields"
    );

const fixedExpensePurchaseDate =
    document.getElementById(
        "fixedExpensePurchaseDate"
    );

const fixedExpenseCutoffDay =
    document.getElementById(
        "fixedExpenseCutoffDay"
    );

const fixedExpenseTotalInstallments =
    document.getElementById(
        "fixedExpenseTotalInstallments"
    );

const fixedExpenseFrequency =
    document.getElementById(
        "fixedExpenseFrequency"
    );

const fixedExpenseDueDay =
    document.getElementById(
        "fixedExpenseDueDay"
    );

    function updateFixedExpenseTypeVisibility() {
    const isInstallment =
        fixedExpenseType?.value === "installment";

    const isRecurring =
        fixedExpenseType?.value === "recurring";

    const isCard =
        fixedExpensePaymentMethod?.value === "card";

    if (installmentFields) {
        installmentFields.style.display =
            isInstallment ? "contents" : "none";
    }

    if (fixedExpenseCreditCardGroup) {
        fixedExpenseCreditCardGroup.hidden = !isCard;
    }

    if (fixedExpenseChargeDayGroup) {
        fixedExpenseChargeDayGroup.hidden =
            !(isCard && isRecurring);
    }
}

fixedExpenseType?.addEventListener(
    "change",
    updateFixedExpenseTypeVisibility
);

fixedExpensePaymentMethod?.addEventListener(
    "change",
    updateFixedExpenseTypeVisibility
);

updateFixedExpenseTypeVisibility();

const fixedExpenseActive =
    document.getElementById(
        "fixedExpenseActive"
    );

const fixedExpenseNotes =
    document.getElementById(
        "fixedExpenseNotes"
    );

const cancelFixedExpenseButton =
    document.getElementById(
        "cancelFixedExpenseButton"
    );

const fixedExpenseTableContainer =
    document.getElementById(
        "fixedExpenseTableContainer"
    );


function saveFixedExpenses() {

    localStorage.setItem(
        "finanzasGastosFijos",
        JSON.stringify(fixedExpenses)
    );

}

// ============================================================
// SUPABASE - GASTOS FIJOS
// ============================================================

async function initializeFixedExpenses() {

    const user =
        await getCurrentUser();


    if (!user) {

        console.warn(
            "No hay usuario autenticado para cargar gastos fijos."
        );

        renderFixedExpenseTable();

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("gastos_fijos")
            .select(`
    id,
    name,
    category_id,
    category_name,
    currency,
    amount,
    amount_gtq,
    expense_type,
    purchase_date,
    cutoff_day,
    total_installments,
    frequency,
    due_day,
    payment_method,
    credit_card_id,
    charge_day,
    active,
    notes,
    created_at,
    updated_at
`)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        const supabaseFixedExpenses =
            data || [];


        const existingIds =
            new Set(
                supabaseFixedExpenses.map(
                    expense =>
                        expense.id
                )
            );


        const expensesToMigrate =
            fixedExpenses.filter(
                expense =>
                    !existingIds.has(
                        expense.id
                    )
            );


        if (
            expensesToMigrate.length > 0
        ) {

            const rows =
                expensesToMigrate.map(
                    expense => ({

                        id:
                            expense.id,

                        user_id:
                            user.id,

                        name:
                            expense.name,

                        category_id:
                            expense.categoryId,

                        category_name:
                            expense.categoryName,

                        currency:
                            expense.currency,

                        amount:
                            expense.amount,

                        exchange_rate:
                            expense.exchangeRate ||
                            1,

                        amount_gtq:
    expense.amountGTQ,

expense_type:
    expense.expenseType,

start_date:
    expense.startDate,

total_installments:
    expense.totalInstallments,

frequency:
    expense.frequency,

                        due_day:
                            expense.dueDay,

                        active:
                            expense.active !== false,

                        notes:
                            expense.notes ||
                            null,

                        created_at:
                            expense.createdAt ||
                            new Date().toISOString(),

                        updated_at:
                            expense.updatedAt ||
                            new Date().toISOString()

                    })
                );


            const {
                data: migratedData,
                error: migrationError
            } = await supabaseClient
                .from("gastos_fijos")
                .insert(rows)
                .select(`
                    id,
                    name,
                    category_id,
                    category_name,
                    currency,
                    amount,
                    exchange_rate,
                    amount_gtq,
                    expense_type,
                    start_date,
                    total_installments,
                    frequency,
                    due_day,
                    payment_method,
                    credit_card_id,
                    charge_day,
                    active,
                    notes,
                    created_at,
                    updated_at
                `);


            if (migrationError) {
                throw migrationError;
            }


            supabaseFixedExpenses.push(
                ...(migratedData || [])
            );


            console.log(
                `${expensesToMigrate.length} gasto(s) fijo(s) local(es) migrado(s) a Supabase.`
            );

        }


        fixedExpenses =
            supabaseFixedExpenses.map(
                expense => ({

                    id:
                        expense.id,

                    name:
                        expense.name,

                    categoryId:
                        expense.category_id,

                    categoryName:
                        expense.category_name,

                    currency:
                        expense.currency,

                    amount:
                        Number(
                            expense.amount
                        ),

                    exchangeRate:
                        Number(
                            expense.exchange_rate
                        ),

                                        amountGTQ:
                        Number(
                            expense.amount_gtq
                        ),

                    expenseType: 
                        expense.expense_type,

                    purchaseDate: 
                        expense.purchase_date,
                    
                    cutoffDay: 
                        expense.cutoff_day,
                         
                    totalInstallments: 
                        expense.total_installments,

                    frequency:
                        expense.frequency,

                    dueDay:
                        expense.due_day,

                    paymentMethod:
                        expense.payment_method || "cash",

                    creditCardId:
                        expense.credit_card_id || null,

                    chargeDay:
                        expense.charge_day || null,

                    active:
                        expense.active !== false,

                    notes:
                        expense.notes ||
                        "",

                    createdAt:
                        expense.created_at,

                    updatedAt:
                        expense.updated_at

                })
            );


        saveFixedExpenses();

        renderFixedExpenseTable();


        if (
            typeof updateDashboard ===
            "function"
        ) {

            updateDashboard();

        }


        console.log(
            "Gastos fijos sincronizados correctamente con Supabase."
        );


    } catch (error) {

        console.error(
            "Error sincronizando gastos fijos con Supabase:",
            error
        );

        renderFixedExpenseTable();

    }

}

function populateFixedExpenseCategories() {

    if (!fixedExpenseCategory) return;

    const activeCategories =
        categories.expense.filter(
            category => category.active !== false
        );

    fixedExpenseCategory.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;

    activeCategories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category.id;
        option.textContent = category.name;

        fixedExpenseCategory.appendChild(option);

    });

}


// ------------------------------------------------------------
// CALCULAR EQUIVALENTE MENSUAL DEL GASTO FIJO
// ------------------------------------------------------------

function getFixedExpenseMonthlyAmount(expense) {

    const amount =
        parseFloat(
            expense.amountGTQ
        ) || 0;


    // --------------------------------------------------------
    // GASTOS POR CUOTAS
    // --------------------------------------------------------

    if (
        expense.expenseType ===
            "installment" &&
        expense.totalInstallments > 0
    ) {

        return (
            amount /
            Number(
                expense.totalInstallments
            )
        );

    }


    // --------------------------------------------------------
    // GASTOS RECURRENTES
    // --------------------------------------------------------

    switch (expense.frequency) {

        case "weekly":

            return (
                amount *
                52 /
                12
            );


        case "biweekly":

            return (
                amount *
                26 /
                12
            );


        case "yearly":

            return (
                amount /
                12
            );


        case "monthly":
        default:

            return amount;

    }

}


function formatFixedExpenseFrequency(frequency) {

    switch (frequency) {

        case "weekly":
            return "Semanal";

        case "biweekly":
            return "Quincenal";

        case "yearly":
            return "Anual";

        case "monthly":
        default:
            return "Mensual";

    }

}

function getFixedExpenseInstallmentProgress(expense) {
    if (
        expense.expenseType !== "installment" ||
        !expense.purchaseDate ||
        !expense.cutoffDay ||
        !expense.dueDay ||
        !expense.totalInstallments
    ) {
        return null;
    }

    const purchaseDate =
        new Date(
            expense.purchaseDate + "T00:00:00"
        );

    const cutoffDay =
        Number(expense.cutoffDay);

    const paymentDay =
        Number(expense.dueDay);

    const total =
        Number(expense.totalInstallments);

    // Determinar el mes del estado de cuenta
    let statementYear =
        purchaseDate.getFullYear();

    let statementMonth =
        purchaseDate.getMonth();

    /*
     * Si la compra ocurrió después del día de corte,
     * pasa al siguiente estado de cuenta.
     *
     * Ejemplo:
     * Compra: 26/04
     * Corte: 20
     * Estado de cuenta: mayo
     * Pago: 13/06
     */
    if (
        purchaseDate.getDate() >
        cutoffDay
    ) {
        statementMonth++;

        if (statementMonth > 11) {
            statementMonth = 0;
            statementYear++;
        }
    }

    /*
     * La primera cuota se paga en el mes
     * siguiente al estado de cuenta.
     */
    let firstPaymentYear =
        statementYear;

    let firstPaymentMonth =
        statementMonth + 1;

    if (firstPaymentMonth > 11) {
        firstPaymentMonth = 0;
        firstPaymentYear++;
    }

    const firstPaymentDate =
        new Date(
            firstPaymentYear,
            firstPaymentMonth,
            paymentDay
        );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (today < firstPaymentDate) {
        return {
            current: 0,
            total
        };
    }

    const monthsElapsed =
        (
            today.getFullYear() -
            firstPaymentDate.getFullYear()
        ) * 12 +
        (
            today.getMonth() -
            firstPaymentDate.getMonth()
        );

    let current =
        monthsElapsed + 1;

    /*
     * Si todavía no hemos llegado al día
     * de pago del mes actual, ese pago aún
     * no cuenta como realizado.
     */
    if (
        today.getDate() <
        paymentDay
    ) {
        current--;
    }

    current =
        Math.min(
            Math.max(current, 1),
            total
        );

    return {
        current,
        total
    };
}

// ------------------------------------------------------------
// CALCULAR CUOTA CORRESPONDIENTE A UN MES ESPECÍFICO
// ------------------------------------------------------------

function getFixedExpenseInstallmentProgressForMonth(
    expense,
    selectedDate
) {

    if (
        expense.expenseType !==
            "installment" ||
        !expense.purchaseDate ||
        !expense.cutoffDay ||
        !expense.dueDay ||
        !expense.totalInstallments
    ) {
        return null;
    }


    const purchaseDate =
        new Date(
            expense.purchaseDate +
            "T00:00:00"
        );


    const cutoffDay =
        Number(
            expense.cutoffDay
        );


    const paymentDay =
        Number(
            expense.dueDay
        );


    const total =
        Number(
            expense.totalInstallments
        );


    let statementYear =
        purchaseDate.getFullYear();


    let statementMonth =
        purchaseDate.getMonth();


    if (
        purchaseDate.getDate() >
        cutoffDay
    ) {

        statementMonth++;

        if (
            statementMonth > 11
        ) {

            statementMonth = 0;
            statementYear++;

        }

    }


    let firstPaymentYear =
        statementYear;


    let firstPaymentMonth =
        statementMonth + 1;


    if (
        firstPaymentMonth > 11
    ) {

        firstPaymentMonth = 0;
        firstPaymentYear++;

    }


    const firstPaymentDate =
        new Date(
            firstPaymentYear,
            firstPaymentMonth,
            paymentDay
        );


    const selectedYear =
        selectedDate.getFullYear();


    const selectedMonth =
        selectedDate.getMonth();


    const monthsElapsed =
        (
            selectedYear -
            firstPaymentDate.getFullYear()
        ) * 12 +
        (
            selectedMonth -
            firstPaymentDate.getMonth()
        );


    if (
        monthsElapsed < 0 ||
        monthsElapsed >= total
    ) {
        return null;
    }


    return {
        current:
            monthsElapsed + 1,

        total
    };

}

function openFixedExpenseForm(expense = null) {

    if (!fixedExpenseFormPanel) return;

    populateFixedExpenseCategories();

    fixedExpenseForm.reset();

    populateFixedExpenseCreditCardOptions(
    expense?.creditCardId || null
);

    fixedExpenseId.value =
        expense?.id || "";

    if (expense) {

        fixedExpenseName.value =
            expense.name || "";

        fixedExpenseCategory.value =
            expense.categoryId || "";

        fixedExpenseCurrency.value =
            expense.currency || "GTQ";

        fixedExpenseAmount.value =
            expense.amount || "";

        fixedExpenseType.value =
            expense.expenseType || "recurring";

        fixedExpensePurchaseDate.value =
            expense.purchaseDate || "";

        fixedExpenseCutoffDay.value =
            expense.cutoffDay || "";

        fixedExpenseTotalInstallments.value =
           expense.totalInstallments || "";

        fixedExpenseExchangeRate.value =
            expense.exchangeRate || "";

        fixedExpenseFrequency.value =
            expense.frequency || "monthly";

        fixedExpenseDueDay.value =
    expense.dueDay || "";

fixedExpensePaymentMethod.value =
    expense.paymentMethod || "cash";

fixedExpenseCreditCardId.value =
    expense.creditCardId || "";

fixedExpenseChargeDay.value =
    expense.chargeDay || "";

        fixedExpenseActive.value =
            String(
                expense.active !== false
            );

        fixedExpenseNotes.value =
            expense.notes || "";

    } else {

    fixedExpenseCurrency.value = "GTQ";

    fixedExpenseType.value =
        "recurring";

    fixedExpensePurchaseDate.value =
    "";

fixedExpenseCutoffDay.value =
    "";

fixedExpenseTotalInstallments.value =
    "";

    fixedExpenseFrequency.value =
        "monthly";

    fixedExpenseActive.value =
        "true";

}

    updateFixedExpenseExchangeVisibility();
    updateFixedExpenseTypeVisibility();

    fixedExpenseFormPanel.hidden = false;

    fixedExpenseFormPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeFixedExpenseForm() {

    if (!fixedExpenseFormPanel) return;

    fixedExpenseForm.reset();

    fixedExpenseId.value = "";

    fixedExpenseFormPanel.hidden = true;

}


function updateFixedExpenseExchangeVisibility() {

    if (!fixedExpenseExchangeGroup) return;

    if (
        fixedExpenseCurrency.value === "USD"
    ) {

        fixedExpenseExchangeGroup.hidden = false;

        if (
            !fixedExpenseExchangeRate.value
        ) {

            fixedExpenseExchangeRate.value =
                "";

        }

    } else {

        fixedExpenseExchangeGroup.hidden = true;

        fixedExpenseExchangeRate.value =
            "";

    }

}


function getFixedExpenseExchangeRate() {

    const rate =
        parseFloat(
            fixedExpenseExchangeRate.value
        );

    return rate > 0 ? rate : null;

}


async function refreshFixedExpenseRate() {

    if (!refreshFixedExpenseExchangeRate) return;

    refreshFixedExpenseExchangeRate.disabled =
        true;

    if (fixedExpenseExchangeStatus) {

        fixedExpenseExchangeStatus.textContent =
            "Consultando tipo de cambio...";

    }

    try {

        const response =
            await fetch(
                "https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx/TipoCambioDia"
            );

        if (!response.ok) {
            throw new Error("HTTP error");
        }

        const xml =
            await response.text();

        const match =
            xml.match(
                /<Monto>(.*?)<\/Monto>/i
            );

        if (!match) {
            throw new Error(
                "Tipo de cambio no encontrado"
            );
        }

        const rate =
            parseFloat(match[1]);

        if (!rate || rate <= 0) {
            throw new Error(
                "Tipo de cambio inválido"
            );
        }

        fixedExpenseExchangeRate.value =
            rate.toFixed(5);

        if (fixedExpenseExchangeStatus) {

            fixedExpenseExchangeStatus.textContent =
                "Tipo de cambio actualizado.";

        }

    } catch (error) {

        if (fixedExpenseExchangeStatus) {

            fixedExpenseExchangeStatus.textContent =
                "No fue posible consultar Banguat. Ingresa el tipo de cambio manualmente.";

        }

    } finally {

        refreshFixedExpenseExchangeRate.disabled =
            false;

    }

}


function getFixedExpenseCategoryName(
    categoryId
) {

    const category =
        categories.expense.find(
            item => item.id === categoryId
        );

    return (
        category?.name ||
        "Categoría eliminada"
    );

}


if (newFixedExpenseButton) {

    newFixedExpenseButton.addEventListener(
        "click",
        () => openFixedExpenseForm()
    );

}


if (cancelFixedExpenseButton) {

    cancelFixedExpenseButton.addEventListener(
        "click",
        closeFixedExpenseForm
    );

}


if (fixedExpenseCurrency) {

    fixedExpenseCurrency.addEventListener(
        "change",
        updateFixedExpenseExchangeVisibility
    );

}


if (refreshFixedExpenseExchangeRate) {

    refreshFixedExpenseExchangeRate.addEventListener(
        "click",
        refreshFixedExpenseRate
    );

}


if (fixedExpenseForm) {

    fixedExpenseForm.addEventListener(
    "submit",
    async event => {

            event.preventDefault();

            const name =
                fixedExpenseName.value.trim();

            const categoryId =
                fixedExpenseCategory.value;

            const currency =
                fixedExpenseCurrency.value;

            const amount =
                parseFloat(
                    fixedExpenseAmount.value
                );

            const frequency =
                fixedExpenseFrequency.value;

                const expenseType =
    fixedExpenseType.value;

    const paymentMethod =
    fixedExpensePaymentMethod.value || "cash";

const creditCardId =
    paymentMethod === "card"
        ? fixedExpenseCreditCardId.value
        : null;

const chargeDay =
    paymentMethod === "card" &&
    expenseType === "recurring" &&
    fixedExpenseChargeDay.value
        ? Number(fixedExpenseChargeDay.value)
        : null;

const selectedFixedExpenseCard =
    creditCards.find(
        card =>
            String(card.id) === String(creditCardId) &&
            card.active !== false
    );

const purchaseDate =
    fixedExpensePurchaseDate.value ||
    null;

const cutoffDay =
    fixedExpenseCutoffDay.value
        ? Number(fixedExpenseCutoffDay.value)
        : null;

const totalInstallments =
    fixedExpenseTotalInstallments.value
        ? Number(
            fixedExpenseTotalInstallments.value
        )
        : null;

            const dueDay =
                fixedExpenseDueDay.value
                    ? Number(
                        fixedExpenseDueDay.value
                    )
                    : null;

            const active =
                fixedExpenseActive.value === "true";

            const notes =
                fixedExpenseNotes.value.trim();


            if (!name) {

                alert(
                    "Ingresa el nombre del gasto fijo."
                );

                return;

            }

            if (!categoryId) {

                alert(
                    "Selecciona una categoría."
                );

                return;

            }

            if (!amount || amount <= 0) {

                alert(
                    "Ingresa un monto válido."
                );

                return;

            }

            if (
    paymentMethod === "card" &&
    !selectedFixedExpenseCard
) {
    alert("Selecciona una tarjeta de crédito activa.");
    return;
}

if (
    paymentMethod === "card" &&
    expenseType === "recurring" &&
    (!chargeDay || chargeDay < 1 || chargeDay > 31)
) {
    alert("Ingresa el día mensual en que se realiza el cargo.");
    return;
}

            if (
    expenseType === "installment" &&
    (
        !purchaseDate ||
        !cutoffDay ||
        cutoffDay < 1 ||
        cutoffDay > 31 ||
        !totalInstallments ||
        totalInstallments <= 0
    )
) {

    alert(
        "Ingresa la fecha de compra, el día de corte y el número de cuotas."
    );

    return;
}

            let exchangeRate = 1;

            if (currency === "USD") {

                exchangeRate =
                    getFixedExpenseExchangeRate();

                if (!exchangeRate) {

                    alert(
                        "Ingresa un tipo de cambio válido."
                    );

                    return;

                }

            }

            const amountGTQ =
                currency === "USD"
                    ? amount * exchangeRate
                    : amount;

            const existingId =
                fixedExpenseId.value;

            const existingExpense =
                fixedExpenses.find(
                    item => item.id === existingId
                );

            const fixedExpense = {

                id:
                    existingId ||
                    Date.now().toString(),

                name,

                categoryId,

                categoryName:
                    getFixedExpenseCategoryName(
                        categoryId
                    ),
                currency,
                amount,
                exchangeRate,
                amountGTQ,
                expenseType,
                purchaseDate,
                cutoffDay,
                totalInstallments,
               frequency,
               dueDay,
paymentMethod,
creditCardId,
chargeDay,
active,
                notes,
                createdAt:
                    existingExpense?.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

                        };


            const user = await getCurrentUser();

            if (!user) {

                alert(
                    "Tu sesión ha expirado. Inicia sesión nuevamente."
                );

                return;

            }


            const databaseData = {

                id:
                    fixedExpense.id,

                user_id:
                    user.id,

                name:
                    fixedExpense.name,

                category_id:
                    fixedExpense.categoryId,

                category_name:
                    fixedExpense.categoryName,

                currency:
                    fixedExpense.currency,

                amount:
                    fixedExpense.amount,

                exchange_rate:
                    fixedExpense.exchangeRate,

                amount_gtq:
                    fixedExpense.amountGTQ,

                expense_type:
                    fixedExpense.expenseType,

                purchase_date: 
                    fixedExpense.purchaseDate,

                cutoff_day: 
                    fixedExpense.cutoffDay,

                total_installments: 
                    fixedExpense.totalInstallments,

                frequency:
                    fixedExpense.frequency,

                due_day:
    fixedExpense.dueDay,

payment_method:
    fixedExpense.paymentMethod,

credit_card_id:
    fixedExpense.creditCardId,

charge_day:
    fixedExpense.chargeDay,

active:
    fixedExpense.active,

                notes:
                    fixedExpense.notes,

                created_at:
                    fixedExpense.createdAt,

                updated_at:
                    fixedExpense.updatedAt

            };


            const { error } =
                await supabaseClient
                    .from("gastos_fijos")
                    .upsert(databaseData);


            if (error) {

                console.error(
                    "Error guardando gasto fijo en Supabase:",
                    error
                );

                alert(
                    "No se pudo guardar el gasto fijo."
                );

                return;

            }


            if (existingId) {

                const index =
                    fixedExpenses.findIndex(
                        item =>
                            item.id === existingId
                    );

                if (index !== -1) {

                    fixedExpenses[index] =
                        fixedExpense;

                }

            } else {

                fixedExpenses.push(
                    fixedExpense
                );

            }


            saveFixedExpenses();

            renderFixedExpenseTable();

            closeFixedExpenseForm();

            if (
                typeof updateDashboard ===
                "function"
            ) {

                updateDashboard();

            }

        }
    );

}


function renderFixedExpenseTable() {

    if (!fixedExpenseTableContainer) {
        return;
    }

    if (fixedExpenses.length === 0) {

        fixedExpenseTableContainer.innerHTML = `

            <div class="fixed-expense-empty">

                <strong>
                    No hay gastos fijos registrados
                </strong>

                <span>
                    Agrega tu primer gasto recurrente
                    para comenzar.
                </span>

            </div>

        `;

        return;

    }


    const sortedExpenses =
        [...fixedExpenses].sort(
            (a, b) => {

                if (
                    a.active !== b.active
                ) {

                    return a.active ? -1 : 1;

                }

                return a.name.localeCompare(
                    b.name
                );

            }
        );


    let html = `

        <div class="fixed-expense-table-wrapper">

            <table class="fixed-expense-table">

                <thead>

                    <tr>

                        <th>
                            Nombre
                        </th>

                        <th>
                            Categoría
                        </th>

                        <th>
                            Monto
                        </th>

                        <th>
                            Frecuencia
                        </th>

                        <th>
                            Equivalente mensual
                        </th>

                        <th>
                            Día
                        </th>

                        <th>
                            Estado
                        </th>

                        <th>
                            Acciones
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    sortedExpenses.forEach(expense => {

        const monthlyAmount =
            getFixedExpenseMonthlyAmount(
                expense
            );

        const installmentProgress =
    getFixedExpenseInstallmentProgress(
        expense
    );    

        const installmentFinished =
    expense.expenseType === "installment" &&
    installmentProgress &&
    installmentProgress.current >=
        installmentProgress.total;

const statusClass =
    installmentFinished
        ? "inactive"
        : expense.active
            ? "active"
            : "inactive";

        const statusText =
    installmentFinished
        ? "Finalizado"
        : expense.active
            ? "Activo"
            : "Inactivo";


        html += `

            <tr>

                <td>

                    <div class="fixed-expense-name">

                        ${escapeHtml(
                            expense.name
                        )}

                    </div>

                </td>


                <td>

                    <div class="fixed-expense-category">

                        ${escapeHtml(
                            expense.categoryName ||
                            getFixedExpenseCategoryName(
                                expense.categoryId
                            )
                        )}

                    </div>

                </td>


                <td>

                    <div class="fixed-expense-amount">

                        ${formatCurrency(
                            expense.amount,
                            expense.currency
                        )}

                    </div>

                </td>



                    <td>
    <div class="fixed-expense-frequency">

        ${
            expense.expenseType === "installment"
                ? `${formatFixedExpenseFrequency(
                    expense.frequency
                )} · ${
                    installmentProgress
                        ? `${installmentProgress.current} de ${installmentProgress.total}`
                        : "Sin iniciar"
                }`
                : formatFixedExpenseFrequency(
                    expense.frequency
                )
        }

    </div>
</td>


                <td>

                    <div class="fixed-expense-monthly">

                        ${formatCurrency(
                            monthlyAmount,
                            "GTQ"
                        )}

                    </div>

                </td>


                <td>

                    ${expense.expenseType === "recurring" &&
  expense.paymentMethod === "card"
    ? expense.chargeDay
        ? `Día ${expense.chargeDay}`
        : "—"
    : expense.dueDay
        ? `Día ${expense.dueDay}`
        : "—"}

                </td>


                <td>

                    <span
                        class="fixed-expense-status ${statusClass}">

                        ${statusText}

                    </span>

                </td>


                <td>

                    <div
                        class="fixed-expense-actions">

                        <button
                            type="button"
                            class="fixed-expense-action-button edit"
                            data-action="edit"
                            data-id="${expense.id}">

                            Editar

                        </button>


                        <button
                            type="button"
                            class="fixed-expense-action-button delete"
                            data-action="delete"
                            data-id="${expense.id}">

                            Eliminar

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });


    html += `

                </tbody>

            </table>

        </div>

    `;


    fixedExpenseTableContainer.innerHTML =
        html;

}


if (fixedExpenseTableContainer) {

    fixedExpenseTableContainer.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );

            if (!button) return;

            const id =
                button.dataset.id;

            const action =
                button.dataset.action;

            const expense =
                fixedExpenses.find(
                    item => item.id === id
                );

            if (!expense) return;


            if (action === "edit") {

                openFixedExpenseForm(
                    expense
                );

                return;

            }


            if (action === "delete") {

    const confirmed =
        confirm(
            `¿Eliminar el gasto fijo "${expense.name}"?`
        );

    if (!confirmed) return;

    const user =
        await getCurrentUser();

    if (!user) {

        alert(
            "Tu sesión ha expirado. Inicia sesión nuevamente."
        );

        return;
    }

    const {
        error
    } = await supabaseClient
        .from("gastos_fijos")
        .delete()
        .eq(
            "id",
            id
        )
        .eq(
            "user_id",
            user.id
        );

    if (error) {

        console.error(
            "Error eliminando gasto fijo:",
            error
        );

        alert(
            "No se pudo eliminar el gasto fijo."
        );

        return;
    }

    fixedExpenses =
        fixedExpenses.filter(
            item =>
                item.id !== id
        );

    saveFixedExpenses();

    renderFixedExpenseTable();

    if (
        typeof updateDashboard ===
        "function"
    ) {

        updateDashboard();

    }

}

        }
    );

}


populateFixedExpenseCategories();

renderFixedExpenseTable();

// ============================================================
// 13. REPORTES
// ============================================================

const reportYear =
    document.getElementById("reportYear");

const reportMonth =
    document.getElementById("reportMonth");

const reportIncome =
    document.getElementById("reportIncome");

const reportExpenses =
    document.getElementById("reportExpenses");

const reportBalance =
    document.getElementById("reportBalance");

const reportFixed =
    document.getElementById("reportFixed");

const reportBudgetContainer =
    document.getElementById(
        "reportBudgetContainer"
    );

const reportCategoryContainer =
    document.getElementById(
        "reportCategoryContainer"
    );

const reportMonthlyContainer =
    document.getElementById(
        "reportMonthlyContainer"
    );


function getReportYear() {

    return Number(
        reportYear?.value ||
        new Date().getFullYear()
    );

}


function getReportMonth() {

    return reportMonth?.value || "all";

}


function reportDateMatches(
    date,
    year,
    month
) {

    if (!date) {
        return false;
    }

    const value =
        String(date);

    if (
        !value.startsWith(
            String(year)
        )
    ) {
        return false;
    }

    if (month === "all") {
        return true;
    }

    return value.substring(5, 7) === month;

}


function getReportExpenses() {

    return JSON.parse(
        localStorage.getItem(
            "finanzasGastos"
        )
    ) || [];

}


function getReportFixedExpenses() {

    return JSON.parse(
        localStorage.getItem(
            "finanzasGastosFijos"
        )
    ) || [];

}


function getReportBudgets() {

    return JSON.parse(
        localStorage.getItem(
            "finanzasPresupuestos"
        )
    ) || [];

}


function getReportIncomeTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    return incomes.reduce(
        (total, income) => {

            if (
                !reportDateMatches(
                    income.date,
                    year,
                    month
                )
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        income.amountGTQ
                    ) || 0
                );

        },
        0
    );

}


function getReportExpenseTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    return getReportExpenses().reduce(
        (total, expense) => {

            if (
                !reportDateMatches(
                    expense.date,
                    year,
                    month
                )
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        expense.amountGTQ
                    ) || 0
                );

        },
        0
    );

}


function getReportFixedMonthlyTotal() {

    const fixedExpenses =
        getReportFixedExpenses();

    return fixedExpenses.reduce(
        (total, expense) => {

            if (
                expense.active === false
            ) {
                return total;
            }

            const amount =
                parseFloat(
                    expense.amountGTQ
                ) || 0;

            if (expense.expenseType === "installment") {
    return total + getFixedExpenseMonthlyAmount(expense);
}    

            switch (
                expense.frequency
            ) {

                case "weekly":
                    return total +
                        (
                            amount * 52 / 12
                        );

                case "biweekly":
                    return total +
                        (
                            amount * 26 / 12
                        );

                case "yearly":
                    return total +
                        (
                            amount / 12
                        );

                case "monthly":
                default:
                    return total + amount;

            }

        },
        0
    );

}


function updateReportSummary() {

    const income =
        getReportIncomeTotal();

    const expenses =
        getReportExpenseTotal();

    const balance =
        income - expenses;

    const fixed =
        getReportFixedMonthlyTotal();


    if (reportIncome) {

        reportIncome.textContent =
            formatCurrency(
                income,
                "GTQ"
            );

    }


    if (reportExpenses) {

        reportExpenses.textContent =
            formatCurrency(
                expenses,
                "GTQ"
            );

    }


    if (reportBalance) {

        reportBalance.textContent =
            formatCurrency(
                balance,
                "GTQ"
            );

        reportBalance.classList.toggle(
            "report-positive",
            balance > 0
        );

        reportBalance.classList.toggle(
            "report-negative",
            balance < 0
        );

    }


    if (reportFixed) {

        reportFixed.textContent =
            formatCurrency(
                fixed,
                "GTQ"
            );

    }

}


function getReportBudgetTotal() {

    const year =
        getReportYear();

    const month =
        getReportMonth();

    const budgets =
        getReportBudgets();

    if (month === "all") {

        return budgets.reduce(
            (total, budget) => {

                if (
                    !String(
                        budget.month
                    ).startsWith(
                        String(year)
                    )
                ) {
                    return total;
                }

                return total +
                    (
                        parseFloat(
                            budget.amount
                        ) || 0
                    );

            },
            0
        );

    }


    const targetMonth =
        `${year}-${month}`;

    return budgets.reduce(
        (total, budget) => {

            if (
                budget.month !==
                targetMonth
            ) {
                return total;
            }

            return total +
                (
                    parseFloat(
                        budget.amount
                    ) || 0
                );

        },
        0
    );

}


function renderReportBudget() {

    if (!reportBudgetContainer) {
        return;
    }

    const budget =
        getReportBudgetTotal();

    const expenses =
        getReportExpenseTotal();


    if (
        budget === 0 &&
        expenses === 0
    ) {

        reportBudgetContainer.innerHTML = `

            <div class="report-empty">
                No hay presupuesto ni gastos
                registrados para el período seleccionado.
            </div>

        `;

        return;

    }


    const percentage =
        budget > 0
            ? (expenses / budget) * 100
            : 0;

    const visiblePercentage =
        Math.min(
            percentage,
            100
        );

    let progressClass =
        "normal";

    if (percentage > 100) {

        progressClass =
            "danger";

    } else if (percentage >= 80) {

        progressClass =
            "warning";

    }


    let statusText =
        "Dentro del presupuesto.";

    if (percentage > 100) {

        statusText =
            "Presupuesto excedido.";

    } else if (percentage >= 80) {

        statusText =
            "Cerca del límite.";

    }


    reportBudgetContainer.innerHTML = `

        <div class="report-table-wrapper">

            <table class="report-table">

                <thead>

                    <tr>

                        <th>
                            Presupuesto
                        </th>

                        <th>
                            Gasto real
                        </th>

                        <th>
                            Disponible
                        </th>

                        <th>
                            Uso
                        </th>

                        <th>
                            Estado
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td class="report-table-number">

                            ${formatCurrency(
                                budget,
                                "GTQ"
                            )}

                        </td>


                        <td class="report-table-number">

                            ${formatCurrency(
                                expenses,
                                "GTQ"
                            )}

                        </td>


                        <td class="
                            report-table-number
                            ${
                                budget - expenses >= 0
                                    ? "report-positive"
                                    : "report-negative"
                            }
                        ">

                            ${formatCurrency(
                                budget - expenses,
                                "GTQ"
                            )}

                        </td>


                        <td>

                            <div class="report-progress-container">

                                <div
                                    class="
                                        report-progress
                                        ${progressClass}
                                    "
                                    style="
                                        width:
                                        ${visiblePercentage}%;
                                    ">
                                </div>

                            </div>

                            <span class="report-period-label">

                                ${percentage.toFixed(1)}%

                            </span>

                        </td>


                        <td>

                            ${statusText}

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


function renderReportCategories() {

    if (!reportCategoryContainer) {
        return;
    }

    const year =
        getReportYear();

    const month =
        getReportMonth();

    const expenses =
        getReportExpenses();

    const totals = {};


    expenses.forEach(expense => {

        if (
            !reportDateMatches(
                expense.date,
                year,
                month
            )
        ) {
            return;
        }

        const categoryId =
            expense.categoryId ||
            "unknown";

        const category =
            categories.expense.find(
                item =>
                    item.id ===
                    categoryId
            );

        const categoryName =
            category?.name ||
            expense.categoryName ||
            "Categoría eliminada";

        const amount =
            parseFloat(
                expense.amountGTQ
            ) || 0;


        if (!totals[categoryId]) {

            totals[categoryId] = {

                name: categoryName,

                amount: 0

            };

        }


        totals[categoryId].amount +=
            amount;

    });


    const data =
        Object.values(
            totals
        ).sort(
            (a, b) =>
                b.amount - a.amount
        );


    if (data.length === 0) {

        reportCategoryContainer.innerHTML = `

            <div class="report-empty">

                No hay gastos registrados
                para el período seleccionado.

            </div>

        `;

        return;

    }


    const maxAmount =
        Math.max(
            ...data.map(
                item => item.amount
            ),
            0
        );


    let html =
        `<div class="report-category-list">`;


    data.forEach(item => {

        const percentage =
            maxAmount > 0
                ? (
                    item.amount /
                    maxAmount
                ) * 100
                : 0;


        html += `

            <div class="report-category-row">

                <div
                    class="report-category-name"
                    title="${escapeHtml(
                        item.name
                    )}">

                    ${escapeHtml(
                        item.name
                    )}

                </div>


                <div class="report-category-bar-container">

                    <div
                        class="report-category-bar"
                        style="
                            width:
                            ${percentage}%;
                        ">
                    </div>

                </div>


                <div class="report-category-amount">

                    ${formatCurrency(
                        item.amount,
                        "GTQ"
                    )}

                </div>

            </div>

        `;

    });


    html += `</div>`;


    reportCategoryContainer.innerHTML =
        html;

}


function renderReportMonthly() {

    if (!reportMonthlyContainer) {
        return;
    }

    const year =
        getReportYear();

    const expenses =
        getReportExpenses();


    const monthlyData =
        Array.from(
            { length: 12 },
            () => ({
                income: 0,
                expense: 0
            })
        );


    incomes.forEach(income => {

        if (
            !reportDateMatches(
                income.date,
                year,
                "all"
            )
        ) {
            return;
        }

        const month =
            Number(
                String(
                    income.date
                ).substring(5, 7)
            ) - 1;


        if (
            month >= 0 &&
            month < 12
        ) {

            monthlyData[
                month
            ].income +=
                parseFloat(
                    income.amountGTQ
                ) || 0;

        }

    });


    expenses.forEach(expense => {

        if (
            !reportDateMatches(
                expense.date,
                year,
                "all"
            )
        ) {
            return;
        }

        const month =
            Number(
                String(
                    expense.date
                ).substring(5, 7)
            ) - 1;


        if (
            month >= 0 &&
            month < 12
        ) {

            monthlyData[
                month
            ].expense +=
                parseFloat(
                    expense.amountGTQ
                ) || 0;

        }

    });


    const monthNames = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    const hasData =
        monthlyData.some(
            item =>
                item.income > 0 ||
                item.expense > 0
        );


    if (!hasData) {

        reportMonthlyContainer.innerHTML = `

            <div class="report-empty">

                No hay movimientos registrados
                para ${year}.

            </div>

        `;

        return;

    }


    let html = `

        <div class="report-table-wrapper">

            <table class="report-table">

                <thead>

                    <tr>

                        <th>
                            Mes
                        </th>

                        <th>
                            Ingresos
                        </th>

                        <th>
                            Gastos
                        </th>

                        <th>
                            Balance
                        </th>

                    </tr>

                </thead>

                <tbody>

    `;


    monthlyData.forEach(
        (item, index) => {

            const balance =
                item.income -
                item.expense;


            html += `

                <tr>

                    <td>

                        ${monthNames[index]}

                    </td>


                    <td class="report-table-number">

                        ${formatCurrency(
                            item.income,
                            "GTQ"
                        )}

                    </td>


                    <td class="report-table-number">

                        ${formatCurrency(
                            item.expense,
                            "GTQ"
                        )}

                    </td>


                    <td
                        class="
                            report-table-number
                            ${
                                balance >= 0
                                    ? "report-positive"
                                    : "report-negative"
                            }
                        ">

                        ${formatCurrency(
                            balance,
                            "GTQ"
                        )}

                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    reportMonthlyContainer.innerHTML =
        html;

}


function updateReports() {

    updateReportSummary();

    renderReportBudget();

    renderReportCategories();

    renderReportMonthly();

}


if (reportYear) {

    reportYear.addEventListener(
        "change",
        updateReports
    );

}


if (reportMonth) {

    reportMonth.addEventListener(
        "change",
        updateReports
    );

}


updateReports();

// ============================================================
// 14. UTILIDADES
// ============================================================

function formatCurrency(
    amount,
    currency
) {

    const value =
        Number(amount) || 0;


    return new Intl.NumberFormat(
        "es-GT",
        {

            style: "currency",

            currency:
                currency === "USD"
                    ? "USD"
                    : "GTQ",

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        }
    ).format(value);

}


function formatDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const parts =
        dateString.split("-");


    if (
        parts.length !== 3
    ) {

        return dateString;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// 15. INICIALIZACIÓN
// ============================================================

async function initializeAppData() {
    // Inicia la carga de tarjetas desde el principio.
    const creditCardsLoad = initializeCreditCards();

    // Las categorías deben estar listas antes de cargar los demás datos.
    await initializeCategories();

    // Inicia estas cargas en paralelo para no sumar sus tiempos de espera.
    const budgetsLoad = initializeBudgets();

    await Promise.all([
        initializeIncomes(),
        initializeExpenses(),
        initializeFixedExpenses(),
        creditCardsLoad
    ]);

    // Aquí ya están listas tarjetas, gastos y cargos recurrentes.
    renderExpenseTable();
    renderIncomeTable();
    updateDashboard();

    // El presupuesto termina de cargar sin retrasar el panel de tarjetas.
    await budgetsLoad;
}


// Iniciar aplicación
initializeAppData();

// ============================================================
// FIN
// ============================================================