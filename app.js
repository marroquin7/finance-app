
<script>

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto"
];


const defaultCategories = [

  {
    name:"Facturas",
    group:"Obligatorios",
    budget:449.43
  },

  {
    name:"Alquiler",
    group:"Obligatorios",
    budget:2300
  },

  {
    name:"Seguro Lexus",
    group:"Obligatorios",
    budget:400
  },

  {
    name:"Servicios",
    group:"Vida",
    budget:40
  },

  {
    name:"Gasolina",
    group:"Vida",
    budget:300
  },

  {
    name:"Supermercado",
    group:"Vida",
    budget:400
  },

  {
    name:"Comer fuera",
    group:"Vida",
    budget:250
  },

  {
    name:"Ropa",
    group:"Vida",
    budget:100
  },

  {
    name:"Viajes y Salidas",
    group:"Vida",
    budget:200
  },

  {
    name:"Mantenimiento Coches",
    group:"Vida",
    budget:350
  },

  {
    name:"Otros",
    group:"Imprevistos",
    budget:1000
  },

  {
    name:"España",
    group:"Objetivos",
    budget:350
  },

  {
    name:"Boda",
    group:"Objetivos",
    budget:0
  },

  {
    name:"Ahorros",
    group:"Objetivos",
    budget:0
  }

];


const savingsAccounts = [

  "Marcus Miriam",
  "Marcus Cesar",
  "Bluevine ICM",
  "OpenBank",
  "SoFi"

];


const paymentAccounts = [

  "SoFi",
  "C Discover",
  "M Discover",
  "CH United",
  "C WF",
  "M WF"

];


const savingsMovementTypes = [

  "Depósito",
  "Retiro",
  "Intereses"

];


const taxesCategories = [

  "Federal",
  "California",
  "Estimated Taxes",
  "Otros"

];


/* =========================================================
   MES POR FECHA
========================================================= */

function monthFromDate(dateString){

  if(!dateString){
    return null;
  }

  const date =
    new Date(
      dateString + "T00:00:00"
    );

  if(isNaN(date.getTime())){
    return null;
  }

  return months[
    date.getMonth()
  ] || null;
}


/* =========================================================
   CREAR MES
========================================================= */

function createDefaultMonth(){

  return {

    incomes:[

      {
        name:"Salario Cesar",
        expected:0,
        actual:0
      },

      {
        name:"Salario Miriam",
        expected:0,
        actual:0
      },

      {
        name:"SBDC Cesar/Otros",
        expected:0,
        actual:0
      },

      {
        name:"Restante Mes Previo",
        expected:0,
        actual:0
      }

    ],

    budgets:
      Object.fromEntries(
        defaultCategories.map(
          c=>[
            c.name,
            c.budget
          ]
        )
      ),

    transactions:[]

  };

}


/* =========================================================
   ESTADO POR DEFECTO
========================================================= */

const defaultState = {

  active:"Agosto",

  months:
    Object.fromEntries(
      months.map(
        m=>[
          m,
          createDefaultMonth()
        ]
      )
    ),

  recurring:[

    {
      id:"rec-luz",
      name:"Luz",
      cat:"Facturas",
      amount:70,
      freq:"Mensual",
      next:"",
      account:"SoFi",
      note:""
    },

    {
      id:"rec-internet",
      name:"Internet",
      cat:"Facturas",
      amount:47,
      freq:"Mensual",
      next:"",
      account:"SoFi",
      note:""
    },

    {
      id:"rec-telefonia",
      name:"Telefonía",
      cat:"Facturas",
      amount:125,
      freq:"Mensual",
      next:"",
      account:"SoFi",
      note:""
    },

    {
      id:"rec-youtube",
      name:"YouTube",
      cat:"Facturas",
      amount:26.99,
      freq:"Mensual",
      next:"",
      account:"C Discovery",
      note:""
    },

    {
      id:"rec-adobe",
      name:"Adobe",
      cat:"Facturas",
      amount:12.78,
      freq:"Mensual",
      next:"",
      account:"CH United",
      note:""
    },

    {
      id:"rec-netflix",
      name:"Netflix",
      cat:"Facturas",
      amount:9.53,
      freq:"Mensual",
      next:"",
      account:"WF M",
      note:""
    },

    {
      id:"rec-audible",
      name:"Audible",
      cat:"Facturas",
      amount:18.13,
      freq:"Bimensual",
      next:"",
      account:"C Discovery",
      note:""
    },

    {
      id:"rec-amazon",
      name:"Amazon",
      cat:"Facturas",
      amount:140,
      freq:"Anual",
      next:"",
      account:"SoFi",
      note:"Cuota anual"
    },

    {
      id:"rec-alquiler",
      name:"Alquiler",
      cat:"Alquiler",
      amount:2300,
      freq:"Mensual",
      next:"",
      account:"SoFi",
      note:"Se paga el siguiente mes"
    },

    {
      id:"rec-lexus",
      name:"Seguro Lexus",
      cat:"Seguro Lexus",
      amount:400,
      freq:"Semestral",
      next:"",
      account:"CH United",
      note:""
    }

  ],

  savings:[],

  taxes:[],

  todo:[]

};


/* =========================================================
   CARGAR ESTADO
========================================================= */

function loadState(){

  try{

    const saved =
      localStorage.getItem(
        "cmFinanzas2026"
      );

    if(!saved){

      return structuredClone(
        defaultState
      );

    }

    const parsed =
      JSON.parse(saved);


    if(
      !parsed ||
      !parsed.months
    ){

      return structuredClone(
        defaultState
      );

    }


    if(!parsed.recurring){
      parsed.recurring=[];
    }

    if(!parsed.savings){
      parsed.savings=[];
    }

    if(!parsed.taxes){
      parsed.taxes=[];
    }

    if(!parsed.todo){
      parsed.todo=[];
    }


    months.forEach(
      m=>{

        if(
          !parsed.months[m]
        ){

          parsed.months[m] =
            createDefaultMonth();

        }


        if(
          !parsed.months[m].transactions
        ){

          parsed.months[m].transactions=[];

        }


        if(
          !parsed.months[m].incomes
        ){

          parsed.months[m].incomes =
            createDefaultMonth().incomes;

        }


        if(
          !parsed.months[m].budgets
        ){

          parsed.months[m].budgets =
            Object.fromEntries(
              defaultCategories.map(
                c=>[
                  c.name,
                  c.budget
                ]
              )
            );

        }


        /*
          Aseguramos que la categoría
          Ahorros exista en meses antiguos.
        */

        if(
          parsed.months[m].budgets.Ahorros === undefined
        ){

          parsed.months[m].budgets.Ahorros = 0;

        }

      }
    );


    /*
      Añadimos IDs a recurrentes
      antiguos.
    */

    parsed.recurring.forEach(
      (p,i)=>{

        if(!p.id){

          p.id =
            "rec-" +
            Date.now() +
            "-" +
            i;

        }

      }
    );


    /*
      Compatibilidad con movimientos
      de ahorros antiguos.
    */

    parsed.savings =
      parsed.savings.map(
        x=>({

          id:
            x.id ||
            (
              "sav-" +
              Date.now() +
              "-" +
              Math.random()
                .toString(36)
                .slice(2)
            ),

          date:
            x.date ||
            new Date()
              .toISOString()
              .slice(0,10),

          desc:
            x.desc || "",

          amount:
            Number(x.amount) || 0,

          account:
            savingsAccounts.includes(
              x.account
            )
            ? x.account
            : "Marcus Miriam",

          type:
            savingsMovementTypes.includes(
              x.type
            )
            ? x.type
            : "Depósito",

          note:
            x.note || ""

        })
      );


    return parsed;

  }catch(error){

    console.error(
      "Error cargando datos:",
      error
    );

    return structuredClone(
      defaultState
    );

  }

}


let state =
  loadState();


/* =========================================================
   UTILIDADES
========================================================= */

function money(n){

  return new Intl.NumberFormat(
    "en-US",
    {
      style:"currency",
      currency:"USD"
    }
  ).format(
    Number(n) || 0
  );

}


function esc(s){

  return String(
    s ?? ""
  ).replace(
    /[&<>"']/g,
    function(m){

      return {

        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"

      }[m];

    }
  );

}


function save(){

  try{

    localStorage.setItem(
      "cmFinanzas2026",
      JSON.stringify(state)
    );

  }catch(error){

    console.error(
      "No se pudieron guardar los datos:",
      error
    );

  }

}


function month(){

  if(
    !state.months[
      state.active
    ]
  ){

    return state.months.Agosto;

  }

  return state.months[
    state.active
  ];

}


/* =========================================================
   TOTALES MENSUALES
========================================================= */

function totals(m){

  const inc =
    m.incomes.reduce(
      (a,x)=>
        a +
        Number(
          x.actual || 0
        ),
      0
    );


  const incExp =
    m.incomes.reduce(
      (a,x)=>
        a +
        Number(
          x.expected || 0
        ),
      0
    );


  const by={};


  m.transactions.forEach(
    t=>{

      const cat =
        t.cat || "Otros";


      by[cat] =
        (
          by[cat] || 0
        ) +
        Number(
          t.amount || 0
        );

    }
  );


  let expense=0;

  let budget=0;


  Object.entries(
    m.budgets
  ).forEach(
    ([c,b])=>{

      budget +=
        Number(b || 0);

      expense +=
        by[c] || 0;

    }
  );


  return {

    inc,
    incExp,
    expense,
    budget,

    available:
      inc-expense,

    expectedAvailable:
      incExp-budget,

    by

  };

}


/* =========================================================
   CUENTAS / TARJETAS
========================================================= */

function accountTotals(m){

  const accounts={};


  m.transactions.forEach(
    t=>{

      const account =
        String(
          t.account || ""
        ).trim();


      if(!account){
        return;
      }


      accounts[account] =
        (
          accounts[account] || 0
        ) +
        Number(
          t.amount || 0
        );

    }
  );


  return Object.entries(
    accounts
  ).sort(
    (a,b)=>b[1]-a[1]
  );

}


/* =========================================================
   AHORROS
========================================================= */

/*
  Regla:
  - Depósito: suma.
  - Intereses: suma.
  - Retiro: resta.
*/

function savingsAccountBalances(){

  const balances =
    Object.fromEntries(
      savingsAccounts.map(
        account=>[
          account,
          0
        ]
      )
    );


  state.savings.forEach(
    movement=>{

      const account =
        movement.account;


      if(
        !savingsAccounts.includes(
          account
        )
      ){

        return;

      }


      const amount =
        Number(
          movement.amount || 0
        );


      if(
        movement.type === "Retiro"
      ){

        balances[account] -=
          amount;

      }
      else{

        balances[account] +=
          amount;

      }

    }
  );


  return balances;

}


function savingsTotalExcludingSofi(){

  const balances =
    savingsAccountBalances();


  return savingsAccounts
    .filter(
      account=>
        account !== "SoFi"
    )
    .reduce(
      (sum,account)=>
        sum +
        Number(
          balances[account] || 0
        ),
      0
    );

}


function savingsTotalAll(){

  const balances =
    savingsAccountBalances();


  return savingsAccounts
    .reduce(
      (sum,account)=>
        sum +
        Number(
          balances[account] || 0
        ),
      0
    );

}


/*
  Convierte automáticamente una transacción
  mensual con categoría Ahorros en movimiento
  de ahorros.

  Para evitar duplicados se utiliza el
  transactionId.
*/

function syncSavingsFromTransaction(
  transaction,
  oldCategory,
  monthName
){

  /*
    Si ya tiene un movimiento asociado,
    no creamos otro.
  */

  if(
    transaction.savingsMovementId
  ){

    const existingIndex =
      state.savings.findIndex(
        x=>
          x.id ===
          transaction.savingsMovementId
      );


    if(
      existingIndex >= 0
    ){

      /*
        Actualizamos importe y fecha.
      */

      state.savings[
        existingIndex
      ].amount =
        Number(
          transaction.amount || 0
        );

      state.savings[
        existingIndex
      ].date =
        transaction.date ||
        state.savings[
          existingIndex
        ].date;

      return;

    }

  }


  /*
    Solo creamos movimiento cuando
    la categoría sea Ahorros.
  */

  if(
    transaction.cat !== "Ahorros"
  ){

    return;

  }


  const movementId =
    "savtx-" +
    transaction.id;


  /*
    Si por alguna razón ya existe,
    no duplicamos.
  */

  const already =
    state.savings.some(
      x=>
        x.transactionId ===
        transaction.id
    );


  if(already){

    return;

  }


  /*
    Una transacción de Ahorros representa
    por defecto un depósito.

    La cuenta puede ser seleccionada
    posteriormente desde Ahorros.
  */

  state.savings.push({

    id:
      movementId,

    transactionId:
      transaction.id,

    sourceMonth:
      monthName,

    date:
      transaction.date ||
      new Date()
        .toISOString()
        .slice(0,10),

    desc:
      transaction.desc ||
      "Transferencia a ahorros",

    amount:
      Number(
        transaction.amount || 0
      ),

    account:
      transaction.savingsAccount ||
      "Marcus Miriam",

    type:
      transaction.savingsType ||
      "Depósito",

    note:
      transaction.note ||
      "Creado desde transacción"

  });


  transaction.savingsMovementId =
    movementId;

}


function syncAllSavingsTransactions(){

  months.forEach(
    monthName=>{

      const m =
        state.months[
          monthName
        ];


      m.transactions.forEach(
        transaction=>{

          if(
            transaction.cat === "Ahorros"
          ){

            syncSavingsFromTransaction(
              transaction,
              null,
              monthName
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   TAXES
========================================================= */

function taxesTotals(){

  const total =
    state.taxes.reduce(
      (sum,x)=>
        sum +
        Number(
          x.amount || 0
        ),
      0
    );


  const byCategory={};


  state.taxes.forEach(
    x=>{

      const category =
        x.category ||
        "Otros";


      byCategory[category] =
        (
          byCategory[category] || 0
        ) +
        Number(
          x.amount || 0
        );

    }
  );


  return {

    total,
    byCategory

  };

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function renderNav(){

  const nav =
    document.getElementById(
      "nav"
    );


  const items = [

    "Dashboard",

    ...months,

    "Ahorros",

    "Taxes",

    "TO DO"

  ];


  nav.innerHTML="";


  items.forEach(
    item=>{

      const button =
        document.createElement(
          "button"
        );


      button.textContent =
        item;


      if(
        state.active === item
      ){

        button.classList.add(
          "active"
        );

      }


      button.addEventListener(
        "click",
        ()=>go(item)
      );


      nav.appendChild(
        button
      );

    }
  );

}


function go(x){

  state.active =
    x;

  save();

  render();

}


/* =========================================================
   RENDER PRINCIPAL
========================================================= */

function render(){

  try{

    /*
      Primero sincronizamos las
      transacciones de Ahorros.
    */

    syncAllSavingsTransactions();

    save();


    renderNav();


    const app =
      document.getElementById(
        "app"
      );


    app.innerHTML="";


    if(
      state.active === "Dashboard"
    ){

      dashboard(app);

    }
    else if(
      months.includes(
        state.active
      )
    ){

      monthly(app);

    }
    else if(
      state.active === "Ahorros"
    ){

      savingsPage(app);

    }
    else if(
      state.active === "Taxes"
    ){

      taxesPage(app);

    }
    else{

      todo(app);

    }

  }catch(error){

    console.error(error);


    document.getElementById(
      "app"
    ).innerHTML = `

      <div class="error-box">

        <h2>
          Error al cargar la página
        </h2>

        <p>
          ${esc(error.message)}
        </p>

        <button
          onclick="location.reload()">

          Recargar

        </button>

      </div>

    `;

  }

}


/* =========================================================
   DASHBOARD
========================================================= */

function dashboard(a){

  const rows =
    months.map(
      m=>{

        const t =
          totals(
            state.months[m]
          );


        return `

          <tr>

            <td>
              ${m}
            </td>

            <td class="num">
              ${money(t.inc)}
            </td>

            <td class="num">
              ${money(t.expense)}
            </td>

            <td
              class="num ${
                t.available < 0
                ? "bad"
                : "good"
              }">

              ${money(t.available)}

            </td>

          </tr>

        `;

      }
    ).join("");


  const t =
    totals(
      state.months.Agosto
    );


  const savingsBalances =
    savingsAccountBalances();


  const savingsTotal =
    savingsTotalExcludingSofi();


  const taxes =
    taxesTotals();


  const savingsRows =
    savingsAccounts.map(
      account=>`

        <tr>

          <td>
            ${esc(account)}
          </td>

          <td class="num ${
            savingsBalances[account] < 0
            ? "balance-negative"
            : "balance-positive"
          }">

            ${money(
              savingsBalances[account]
            )}

          </td>

        </tr>

      `
    ).join("");


  const taxRows =
    taxesCategories.map(
      category=>`

        <tr>

          <td>
            ${esc(category)}
          </td>

          <td class="num">
            ${money(
              taxes.byCategory[
                category
              ] || 0
            )}
          </td>

        </tr>

      `
    ).join("");


  a.innerHTML = `

    <div class="toolbar">

      <button
        class="primary"
        id="exportBtn">

        Exportar datos

      </button>


      <label class="btn">

        Importar datos

        <input
          id="importFile"
          type="file"
          accept=".json"
          hidden>

      </label>


      <button
        id="resetBtn">

        Restablecer plantilla

      </button>

    </div>


    <!-- KPIS -->

    <div class="kpis">

      <div class="kpi">

        <div class="label">
          Ingresos reales — Agosto
        </div>

        <div class="value">
          ${money(t.inc)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Gastos reales — Agosto
        </div>

        <div class="value">
          ${money(t.expense)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Disponible — Agosto
        </div>

        <div class="value">
          ${money(t.available)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Ahorros — excluyendo SoFi
        </div>

        <div class="value">
          ${money(savingsTotal)}
        </div>

      </div>

    </div>


    <!-- RESUMEN MENSUAL -->

    <div class="card">

      <h2>
        Resumen mensual
      </h2>

      <table>

        <tr>

          <th>
            Mes
          </th>

          <th class="num">
            Ingresos
          </th>

          <th class="num">
            Gastos
          </th>

          <th class="num">
            Disponible
          </th>

        </tr>

        ${rows}

      </table>

    </div>


    <!-- AHORROS + TAXES -->

    <div class="dashboard-summary-grid">

      <div class="card savings-card">

        <div class="card-header">

          <h2>
            Resumen de Ahorros
          </h2>

          <button
            class="small-btn"
            id="goSavings">

            Ver Ahorros

          </button>

        </div>


        <table>

          <tr>

            <th>
              Cuenta
            </th>

            <th class="num">
              Saldo
            </th>

          </tr>

          ${savingsRows}


          <tr class="total">

            <td>
              TOTAL — excluyendo SoFi
            </td>

            <td class="num">
              ${money(savingsTotal)}
            </td>

          </tr>


          <tr>

            <td>
              Total incluyendo SoFi
            </td>

            <td class="num">
              ${money(
                savingsTotalAll()
              )}
            </td>

          </tr>

        </table>

      </div>


      <div class="card">

        <div class="card-header">

          <h2>
            Resumen de Taxes
          </h2>

          <button
            class="small-btn"
            id="goTaxes">

            Ver Taxes

          </button>

        </div>


        <table>

          <tr>

            <th>
              Categoría
            </th>

            <th class="num">
              Total
            </th>

          </tr>

          ${taxRows}


          <tr class="total">

            <td>
              TOTAL TAXES
            </td>

            <td class="num">
              ${money(taxes.total)}
            </td>

          </tr>

        </table>

      </div>

    </div>


    <!-- INSTRUCCIONES -->

    <div
      class="card"
      style="margin-top:16px">

      <h2>
        Cómo usarla
      </h2>

      <div class="sticky-note">

        <b>1.</b>
        Introduce tus movimientos en
        <b>Transacciones</b>.

        <br><br>

        <b>2.</b>
        Usa los pagos recurrentes y pulsa
        <b>Registrar</b> para convertirlos
        automáticamente en transacciones.

        <br><br>

        <b>3.</b>
        Las transacciones con categoría
        <b>Ahorros</b> aparecen automáticamente
        en la página de Ahorros.

        <br><br>

        <b>4.</b>
        En Ahorros puedes asignar cada movimiento
        a una cuenta y definir si es depósito,
        retiro o intereses.

      </div>

    </div>

  `;


  document
    .getElementById(
      "exportBtn"
    )
    .addEventListener(
      "click",
      downloadBackup
    );


  document
    .getElementById(
      "importFile"
    )
    .addEventListener(
      "change",
      importBackup
    );


  document
    .getElementById(
      "resetBtn"
    )
    .addEventListener(
      "click",
      resetData
    );


  document
    .getElementById(
      "goSavings"
    )
    .addEventListener(
      "click",
      ()=>go("Ahorros")
    );


  document
    .getElementById(
      "goTaxes"
    )
    .addEventListener(
      "click",
      ()=>go("Taxes")
    );

}


/* =========================================================
   PÁGINA MENSUAL
========================================================= */

function monthly(a){

  const m =
    month();


  const t =
    totals(m);


  const accountData =
    accountTotals(m);


  const totalAccounts =
    accountData.reduce(
      (sum,x)=>
        sum+x[1],
      0
    );


  /*
    INGRESOS
  */

  const incomeRows =
    m.incomes.map(
      (x,i)=>`

        <tr>

          <td>
            ${esc(x.name)}
          </td>

          <td>

            <input
              type="number"
              step=".01"
              value="${x.expected}"
              data-income="${i}"
              data-field="expected">

          </td>

          <td>

            <input
              type="number"
              step=".01"
              value="${x.actual}"
              data-income="${i}"
              data-field="actual">

          </td>

          <td class="num">

            ${money(
              Number(x.actual) -
              Number(x.expected)
            )}

          </td>

        </tr>

      `
    ).join("");


  /*
    CATEGORÍAS
  */

  const catRows =
    Object.entries(
      m.budgets
    ).map(
      ([c,b])=>{

        const act =
          t.by[c] || 0;


        const rem =
          Number(b)-act;


        return `

          <tr>

            <td>
              ${esc(c)}
            </td>

            <td>

              <input
                type="number"
                step=".01"
                value="${b}"
                data-budget="${esc(c)}">

            </td>

            <td class="num">
              ${money(act)}
            </td>

            <td
              class="num ${
                rem < 0
                ? "bad"
                : "good"
              }">

              ${money(rem)}

            </td>

            <td class="num">

              ${
                Number(b)
                ? (
                    (act /
                    Number(b)) *
                    100
                  ).toFixed(0)+"%"
                : "—"
              }

            </td>

            <td class="actions">

              <button
                class="danger small-btn"
                data-delete-category="${esc(c)}">

                ×

              </button>

            </td>

          </tr>

        `;

      }
    ).join("");


  /*
    PAGOS RECURRENTES
  */

  const recurringRows =
    renderRecurringRows(
      state.active
    );


  /*
    GASTOS POR CUENTA
  */

  const accountRows =
    accountData.length

    ? accountData.map(
        ([account,total])=>{

          const percent =
            totalAccounts
            ? (
                total /
                totalAccounts
              ) * 100
            : 0;


          return `

            <tr>

              <td>

                <div class="account-name">

                  ${esc(account)}

                </div>


                <div
                  class="account-bar">

                  <div
                    class="account-bar-inner"
                    style="width:${percent}%">
                  </div>

                </div>

              </td>

              <td
                class="num account-total">

                ${money(total)}

              </td>

              <td class="num">

                ${percent.toFixed(1)}%

              </td>

            </tr>

          `;

        }
      ).join("")

    : `

      <tr>

        <td
          colspan="3"
          class="empty">

          Todavía no hay gastos asociados
          a ninguna cuenta o tarjeta.

        </td>

      </tr>

    `;


  /*
    HTML

    IMPORTANTE:
    month-layout coloca ingresos y
    ingresos vs gastos a la izquierda,
    y gastos a la derecha.
  */

  a.innerHTML = `

    <div class="toolbar">

      <button
        class="primary"
        id="newTxMonthly">

        + Nueva transacción

      </button>

    </div>


    <!-- KPIS -->

    <div class="kpis">

      <div class="kpi">

        <div class="label">
          Ingresos esperados
        </div>

        <div class="value">
          ${money(t.incExp)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Ingresos reales
        </div>

        <div class="value">
          ${money(t.inc)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Gastos reales
        </div>

        <div class="value">
          ${money(t.expense)}
        </div>

      </div>


      <div class="kpi">

        <div class="label">
          Disponible
        </div>

        <div class="value">
          ${money(t.available)}
        </div>

      </div>

    </div>


    <!--
      COLUMNA IZQUIERDA:
      INGRESOS
      INGRESOS VS GASTOS
    -->

    <div class="month-layout">


      <div class="month-left">


        <!-- INGRESOS -->

        <div class="card">

          <h2>
            INGRESOS
          </h2>

          <table>

            <tr>

              <th>
                Ingreso
              </th>

              <th>
                Esperado
              </th>

              <th>
                Realidad
              </th>

              <th>
                Diferencia
              </th>

            </tr>

            ${incomeRows}

            <tr class="total">

              <td>
                TOTAL
              </td>

              <td class="num">
                ${money(t.incExp)}
              </td>

              <td class="num">
                ${money(t.inc)}
              </td>

              <td class="num">
                ${money(
                  t.inc-t.incExp
                )}
              </td>

            </tr>

          </table>

        </div>


        <!-- INGRESOS VS GASTOS -->

        <div class="card">

          <h2>
            INGRESOS VS GASTOS
          </h2>

          <table>

            <tr>

              <th>
                Concepto
              </th>

              <th class="num">
                Presupuesto
              </th>

              <th class="num">
                Actual
              </th>

            </tr>

            <tr>

              <td>
                Ingresos
              </td>

              <td class="num">
                ${money(t.incExp)}
              </td>

              <td class="num">
                ${money(t.inc)}
              </td>

            </tr>

            <tr>

              <td>
                Gastos
              </td>

              <td class="num">
                ${money(t.budget)}
              </td>

              <td class="num">
                ${money(t.expense)}
              </td>

            </tr>

            <tr class="total">

              <td>
                DIFERENCIA
              </td>

              <td
                class="num ${
                  t.expectedAvailable < 0
                  ? "bad"
                  : "good"
                }">

                ${money(
                  t.expectedAvailable
                )}

              </td>

              <td
                class="num ${
                  t.available < 0
                  ? "bad"
                  : "good"
                }">

                ${money(
                  t.available
                )}

              </td>

            </tr>

          </table>

        </div>

    <!-- GASTOS POR CUENTA -->

    <div
      class="card"
      style="margin-top:16px">

      <div class="card-header">

        <h2>
          GASTOS POR CUENTA / TARJETA
        </h2>

        <div class="small">

          Total:
          <b>
            ${money(totalAccounts)}
          </b>

        </div>

      </div>


      <div class="info">

        Este resumen se calcula automáticamente
        a partir de las transacciones del mes.

      </div>


      <table>

        <tr>

          <th>
            Cuenta / Tarjeta
          </th>

          <th class="num">
            Gastado
          </th>

          <th class="num">
            %
          </th>

        </tr>

        ${accountRows}


        ${
          accountData.length
          ? `

            <tr class="total">

              <td>
                TOTAL
              </td>

              <td class="num">
                ${money(totalAccounts)}
              </td>

              <td class="num">
                100%
              </td>

            </tr>

          `
          : ""
        }

      </table>

    </div>


      

    

      </div>
           <!--
        COLUMNA DERECHA:
        GASTOS
      -->

      <div class="month-right">


        <!-- GASTOS -->

        <div class="card">

          <div class="card-header">

            <h2>
              Gastos Por Categoría
            </h2>

          </div>

          <table>

            <tr>

              <th>
                Categoría
              </th>

              <th>
                Presupuesto
              </th>

              <th>
                Realidad
              </th>

              <th>
                Restante
              </th>

              <th>
                %
              </th>

              <th></th>

            </tr>

            ${catRows}

            <tr class="total">

              <td>
                TOTAL
              </td>

              <td class="num">
                ${money(t.budget)}
              </td>

              <td class="num">
                ${money(t.expense)}
              </td>

              <td class="num">
                ${money(
                  t.budget -
                  t.expense
                )}
              </td>

              <td></td>

              <td></td>

            </tr>

          </table>


          <!-- AÑADIR CATEGORÍA -->

          <div class="section-title">

            Añadir categoría de gastos

          </div>


          <div class="category-add-box">

            <input
              id="newCategoryName"
              placeholder="Nombre de nueva categoría">

            <input
              id="newCategoryBudget"
              type="number"
              step=".01"
              placeholder="Presupuesto">

            <button
              class="primary"
              id="addCategoryBtn">

              + Añadir

            </button>

          </div>


          <div class="small"
               style="margin-top:8px">

            La categoría se añadirá a todos los
            meses y quedará disponible para
            futuras transacciones.

          </div>

        </div>

</div>
</div>
    <!-- PAGOS RECURRENTES -->

    <div
      class="card"
      style="margin-top:16px">

      <div class="card-header">

        <h2>
          PAGOS RECURRENTES — ${state.active}
        </h2>

        <button
          class="small-btn"
          id="addRecurring">

          + Añadir pago

        </button>

      </div>


      <div class="info">

        Los pagos aparecen en el mes correspondiente
        según su <b>Próxima fecha</b>.

        Pulsa <b>Registrar</b> para convertirlos
        automáticamente en una transacción.

      </div>


      <div class="recurring-table">

        <table>

          <tr>

            <th>
              Pago
            </th>

            <th>
              Categoría
            </th>

            <th>
              Importe
            </th>

            <th>
              Frecuencia
            </th>

            <th>
              Fecha
            </th>

            <th>
              Cuenta
            </th>

            <th>
              Acción
            </th>

          </tr>

          ${recurringRows}

        </table>

      </div>

    </div>


    <!-- TRANSACCIONES -->

    <div
      class="card"
      style="margin-top:16px">

      <div class="card-header">

        <h2>
          TRANSACCIONES — ${state.active}
        </h2>

        <button
          class="primary"
          id="newTxBottom">

          + Transacción

        </button>

      </div>


      <div class="transaction-table">

        ${renderTransactionTable(m)}

      </div>

    </div>

  `;


  /*
    Botones
  */

  document
    .getElementById(
      "newTxMonthly"
    )
    .addEventListener(
      "click",
      addTx
    );


  document
    .getElementById(
      "newTxBottom"
    )
    .addEventListener(
      "click",
      addTx
    );


  document
    .getElementById(
      "addRecurring"
    )
    .addEventListener(
      "click",
      addRecurring
    );


  /*
    Ingresos
  */

  a.querySelectorAll(
    "[data-income]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.income
            );


          const field =
            this.dataset.field;


          m.incomes[i][field] =
            Number(
              this.value
            ) || 0;


          save();

          render();

        }
      );

    }
  );


  /*
    Presupuestos
  */

  a.querySelectorAll(
    "[data-budget]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const category =
            this.dataset.budget;


          m.budgets[
            category
          ] =
            Number(
              this.value
            ) || 0;


          save();

          render();

        }
      );

    }
  );


  /*
    Eliminar categoría
  */

  a.querySelectorAll(
    "[data-delete-category]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const category =
            this.dataset.deleteCategory;


          if(
            category === "Ahorros"
          ){

            alert(
              "La categoría Ahorros es necesaria para sincronizar los movimientos de ahorro."
            );

            return;

          }


          if(
            category === "Otros"
          ){

            alert(
              "La categoría Otros no puede eliminarse."
            );

            return;

          }


          const used =
            months.some(
              monthName=>
                state.months[
                  monthName
                ].transactions.some(
                  tx=>
                    tx.cat === category
                )
            );


          const message =
            used

            ? (
              "Esta categoría tiene transacciones asociadas. " +
              "Eliminarla hará que esas transacciones " +
              "dejen de aparecer correctamente en el presupuesto. " +
              "¿Continuar?"
            )

            : (
              "¿Eliminar la categoría " +
              category +
              "?"
            );


          if(
            confirm(message)
          ){

            months.forEach(
              monthName=>{

                delete state.months[
                  monthName
                ].budgets[
                  category
                ];

              }
            );


            save();

            render();

          }

        }
      );

    }
  );


  /*
    Añadir categoría
  */

  document
    .getElementById(
      "addCategoryBtn"
    )
    .addEventListener(
      "click",
      addExpenseCategory
    );


  /*
    Transacciones
  */

  attachTransactionEvents(a);


  /*
    Recurrentes
  */

  attachRecurringEvents(a);

}


/* =========================================================
   AÑADIR CATEGORÍA
========================================================= */

function addExpenseCategory(){

  const nameInput =
    document.getElementById(
      "newCategoryName"
    );


  const budgetInput =
    document.getElementById(
      "newCategoryBudget"
    );


  const name =
    String(
      nameInput.value || ""
    ).trim();


  const budget =
    Number(
      budgetInput.value
    ) || 0;


  if(!name){

    alert(
      "Introduce un nombre para la categoría."
    );

    return;

  }


  if(
    months.some(
      monthName=>
        Object.prototype.hasOwnProperty.call(
          state.months[
            monthName
          ].budgets,
          name
        )
    )
  ){

    alert(
      "Esa categoría ya existe."
    );

    return;

  }


  months.forEach(
    monthName=>{

      state.months[
        monthName
      ].budgets[name] =
        budget;

    }
  );


  save();

  render();

}


/* =========================================================
   PAGOS RECURRENTES
========================================================= */

function renderRecurringRows(
  monthName
){

  const rows=[];


  state.recurring.forEach(
    (p,index)=>{

      let paymentMonth =
        monthFromDate(
          p.next
        );


      if(!paymentMonth){

        paymentMonth =
          monthName;

      }


      if(
        paymentMonth !==
        monthName
      ){

        return;

      }


      const registered =
        isRecurringRegistered(
          p.id,
          monthName
        );


      rows.push(`

        <tr>

          <td>

            <input
              value="${esc(p.name)}"
              data-rp="${index}"
              data-field="name">

          </td>


          <td>

            <select
              data-rp="${index}"
              data-field="cat">

              ${Object.keys(
                month().budgets
              ).map(
                c=>`

                  <option
                    value="${esc(c)}"
                    ${
                      c === p.cat
                      ? "selected"
                      : ""
                    }>

                    ${esc(c)}

                  </option>

                `
              ).join("")}

            </select>

          </td>


          <td>

            <input
              type="number"
              step=".01"
              value="${p.amount}"
              data-rp="${index}"
              data-field="amount">

          </td>


          <td>

            <input
              value="${esc(p.freq)}"
              data-rp="${index}"
              data-field="freq">

          </td>


          <td>

            <input
              type="date"
              value="${p.next || ""}"
              data-rp="${index}"
              data-field="next">

          </td>


          <td>

            <select
              data-rp="${index}"
              data-field="account">

              ${paymentAccounts.map(
                account=>{

                  const legacy = {
                    "C Discover":"C Discovery",
                    "M Discover":"M Discovery",
                    "CH United":"CH United",
                    "C WF":"C WF",
                    "M WF":"WF M",
                    "SoFi":"SoFi"
                  }[account];

                  return `

                    <option
                      value="${esc(account)}"
                      ${
                        (p.account === account || p.account === legacy)
                        ? "selected"
                        : ""
                      }>

                      ${esc(account)}

                    </option>

                  `;

                }
              ).join("")}

            </select>

          </td>


          <td class="actions">

            ${
              registered

              ? `

                <button
                  class="registered"
                  disabled>

                  Registrado ✓

                </button>

              `

              : `

                <button
                  class="success"
                  data-register="${index}">

                  Registrar

                </button>

              `
            }


            <button
              class="danger small-btn"
              data-delete-rp="${index}">

              ×

            </button>

          </td>

        </tr>

      `);

    }
  );


  if(!rows.length){

    return `

      <tr>

        <td
          colspan="7"
          class="empty">

          No hay pagos recurrentes
          programados para ${monthName}.

          <br><br>

          Puedes añadir uno con
          <b>+ Añadir pago</b>.

        </td>

      </tr>

    `;

  }


  return rows.join("");

}


/* =========================================================
   COMPROBAR RECURRENTE
========================================================= */

function isRecurringRegistered(
  recurringId,
  monthName
){

  const m =
    state.months[
      monthName
    ];


  if(!m){
    return false;
  }


  return m.transactions.some(
    t=>
      t.recurringId ===
      recurringId
  );

}


/* =========================================================
   REGISTRAR RECURRENTE
========================================================= */

function registerRecurring(
  index
){

  const p =
    state.recurring[
      index
    ];


  if(!p){
    return;
  }


  let targetMonth =
    monthFromDate(
      p.next
    );


  if(!targetMonth){

    targetMonth =
      state.active;

  }


  const m =
    state.months[
      targetMonth
    ];


  const already =
    m.transactions.some(
      t=>
        t.recurringId ===
        p.id
    );


  if(already){

    alert(
      "Este pago ya está registrado en " +
      targetMonth + "."
    );

    return;

  }


  const transaction={

    id:
      "tx-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2),

    recurringId:
      p.id,

    date:
      p.next ||
      new Date()
        .toISOString()
        .slice(0,10),

    desc:
      p.name,

    cat:
      p.cat ||
      "Otros",

    amount:
      Number(
        p.amount
      ) || 0,

    account:
      p.account ||
      "",

    note:
      p.note ||
      "Pago recurrente"

  };


  m.transactions.push(
    transaction
  );


  /*
    Si el pago recurrente es Ahorros,
    creamos el movimiento de ahorro.
  */

  if(
    transaction.cat ===
    "Ahorros"
  ){

    syncSavingsFromTransaction(
      transaction,
      null,
      targetMonth
    );

  }


  save();


  state.active =
    targetMonth;


  save();

  render();

}


/* =========================================================
   EVENTOS RECURRENTES
========================================================= */

function attachRecurringEvents(a){

  a.querySelectorAll(
    "[data-rp]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.rp
            );


          const field =
            this.dataset.field;


          if(
            !state.recurring[i]
          ){

            return;

          }


          state.recurring[i][field] =

            field === "amount"

            ? Number(
                this.value
              ) || 0

            : this.value;


          save();

          render();

        }
      );

    }
  );


  a.querySelectorAll(
    "[data-register]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.register
            );


          registerRecurring(i);

        }
      );

    }
  );


  a.querySelectorAll(
    "[data-delete-rp]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.deleteRp
            );


          if(
            confirm(
              "¿Eliminar este pago recurrente?"
            )
          ){

            state.recurring.splice(
              i,
              1
            );


            save();

            render();

          }

        }
      );

    }
  );

}


/* =========================================================
   AÑADIR RECURRENTE
========================================================= */

function addRecurring(){

  state.recurring.push({

    id:
      "rec-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2),

    name:
      "Nuevo pago",

    cat:
      "Facturas",

    amount:
      0,

    freq:
      "Mensual",

    next:
      "",

    account:
      "",

    note:
      ""

  });


  save();

  render();

}


/* =========================================================
   TABLA TRANSACCIONES
========================================================= */

function renderTransactionTable(m){

  if(
    !m.transactions.length
  ){

    return `

      <table>

        <tbody>

          <tr>

            <td
              colspan="8"
              class="empty">

              No hay transacciones todavía.
              Pulsa "+ Transacción"
              para añadir una.

            </td>

          </tr>

        </tbody>

      </table>

    `;

  }


  const rows =
    m.transactions.map(
      (t,i)=>`

        <tr>

          <td>

            <input
              type="date"
              value="${esc(t.date || "")}"
              data-tx="${i}"
              data-field="date">

          </td>


          <td>

            <input
              value="${esc(t.desc || "")}"
              placeholder="Descripción"
              data-tx="${i}"
              data-field="desc">

          </td>


          <td>

            <select
              data-tx="${i}"
              data-field="cat">

              ${Object.keys(
                m.budgets
              ).map(
                c=>`

                  <option
                    value="${esc(c)}"
                    ${
                      c === t.cat
                      ? "selected"
                      : ""
                    }>

                    ${esc(c)}

                  </option>

                `
              ).join("")}

            </select>

          </td>


          <td>

            <input
              type="number"
              step=".01"
              value="${Number(t.amount || 0)}"
              data-tx="${i}"
              data-field="amount">

          </td>


          <td>

            <select
              data-tx="${i}"
              data-field="account">

              ${paymentAccounts.map(
                account=>{

                  const legacy = {
                    "C Discover":"C Discovery",
                    "M Discover":"M Discovery",
                    "CH United":"CH United",
                    "C WF":"C WF",
                    "M WF":"WF M",
                    "SoFi":"SoFi"
                  }[account];

                  return `

                    <option
                      value="${esc(account)}"
                      ${
                        (t.account === account || t.account === legacy)
                        ? "selected"
                        : ""
                      }>

                      ${esc(account)}

                    </option>

                  `;

                }
              ).join("")}

            </select>

          </td>


          <td>

            ${
              t.cat === "Ahorros"

              ? `

                <select
                  data-tx="${i}"
                  data-field="savingsAccount">

                  ${savingsAccounts.map(
                    account=>`

                      <option
                        value="${esc(account)}"
                        ${
                          (
                            t.savingsAccount ||
                            "Marcus Miriam"
                          ) === account
                          ? "selected"
                          : ""
                        }>

                        ${esc(account)}

                      </option>

                    `
                  ).join("")}

                </select>

              `

              : ""

            }

          </td>


          <td>

            <input
              value="${esc(t.note || "")}"
              placeholder="Comentario"
              data-tx="${i}"
              data-field="note">

          </td>


          <td class="actions">

            ${
              t.savingsMovementId

              ? `

                <span
                  class="small"
                  title="Registrada también en Ahorros">

                  💰

                </span>

              `

              : ""

            }


            ${
              t.recurringId

              ? `

                <span
                  class="small"
                  title="Creada desde pago recurrente">

                  ↻

                </span>

              `

              : ""

            }


            <button
              class="danger"
              data-delete-tx="${i}">

              ×

            </button>

          </td>

        </tr>

      `
    ).join("");


  return `

    <table>

      <thead>

        <tr>

          <th>
            Fecha
          </th>

          <th>
            Descripción
          </th>

          <th>
            Categoría
          </th>

          <th>
            Importe
          </th>

          <th>
            Cuenta/Tarjeta
          </th>

          <th>
            Cuenta ahorro
          </th>

          <th>
            Comentario
          </th>

          <th></th>

        </tr>

      </thead>

      <tbody>

        ${rows}

      </tbody>

    </table>

  `;

}


/* =========================================================
   AÑADIR TRANSACCIÓN
========================================================= */

function addTx(){

  const m =
    month();


  m.transactions.push({

    id:
      "tx-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2),

    recurringId:
      null,

    savingsMovementId:
      null,

    date:
      new Date()
        .toISOString()
        .slice(0,10),

    desc:
      "",

    cat:
      "Otros",

    amount:
      0,

    account:
      "",

    savingsAccount:
      "Marcus Miriam",

    savingsType:
      "Depósito",

    note:
      ""

  });


  save();

  render();

}


/* =========================================================
   EVENTOS TRANSACCIONES
========================================================= */

function attachTransactionEvents(a){

  const m =
    month();


  a.querySelectorAll(
    "[data-tx]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.tx
            );


          const field =
            this.dataset.field;


          if(
            !m.transactions[i]
          ){

            return;

          }


          const tx =
            m.transactions[i];


          /*
            Si cambia la fecha,
            movemos la transacción al
            mes correspondiente.
          */

          if(
            field === "date" &&
            this.value
          ){

            const targetMonth =
              monthFromDate(
                this.value
              );


            if(
              targetMonth &&
              targetMonth !==
              state.active
            ){

              const exists =
                state.months[
                  targetMonth
                ].transactions.some(
                  existing=>
                    existing.id ===
                    tx.id
                );


              if(!exists){

                state.months[
                  targetMonth
                ].transactions.push(
                  tx
                );

              }


              m.transactions.splice(
                i,
                1
              );


              /*
                Si la transacción estaba
                vinculada a ahorros, la
                mantenemos vinculada.
              */

              if(
                tx.savingsMovementId
              ){

                const movement =
                  state.savings.find(
                    x=>
                      x.id ===
                      tx.savingsMovementId
                  );


                if(movement){

                  movement.date =
                    this.value;

                  movement.sourceMonth =
                    targetMonth;

                }

              }


              state.active =
                targetMonth;


              save();

              render();

              return;

            }

          }


          /*
            Cambio de categoría.
          */

          if(
            field === "cat"
          ){

            const oldCategory =
              tx.cat;


            tx.cat =
              this.value;


            /*
              Si pasa a Ahorros,
              creamos el movimiento.
            */

            if(
              tx.cat === "Ahorros"
            ){

              if(
                !tx.savingsAccount
              ){

                tx.savingsAccount =
                  "Marcus Miriam";

              }


              if(
                !tx.savingsType
              ){

                tx.savingsType =
                  "Depósito";

              }


              syncSavingsFromTransaction(
                tx,
                oldCategory,
                state.active
              );

            }


            /*
              Si deja de ser Ahorros,
              eliminamos el movimiento
              automático asociado.

              Esto NO elimina movimientos
              creados manualmente.
            */

            else if(
              oldCategory ===
              "Ahorros" &&
              tx.savingsMovementId
            ){

              const index =
                state.savings.findIndex(
                  x=>
                    x.id ===
                    tx.savingsMovementId
                );


              if(index >= 0){

                state.savings.splice(
                  index,
                  1
                );

              }


              tx.savingsMovementId =
                null;

            }

          }

          else if(
            field === "amount"
          ){

            tx.amount =
              Number(
                this.value
              ) || 0;


            if(
              tx.cat ===
              "Ahorros"
            ){

              syncSavingsFromTransaction(
                tx,
                null,
                state.active
              );

            }

          }

          else if(
            field ===
            "savingsAccount"
          ){

            tx.savingsAccount =
              this.value;


            if(
              tx.savingsMovementId
            ){

              const movement =
                state.savings.find(
                  x=>
                    x.id ===
                    tx.savingsMovementId
                );


              if(movement){

                movement.account =
                  this.value;

              }

            }

          }

          else{

            tx[field] =
              this.value;

          }


          /*
            Después de cualquier cambio
            en una transacción de Ahorros,
            mantenemos sincronizado el
            movimiento.
          */

          if(
            tx.cat ===
            "Ahorros"
          ){

            syncSavingsFromTransaction(
              tx,
              null,
              state.active
            );

          }


          save();

          render();

        }
      );

    }
  );


  a.querySelectorAll(
    "[data-delete-tx]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.deleteTx
            );


          const tx =
            m.transactions[i];


          if(!tx){
            return;
          }


          if(
            confirm(
              "¿Eliminar esta transacción?"
            )
          ){

            /*
              Si estaba vinculada a Ahorros,
              eliminamos también el movimiento
              automático.
            */

            if(
              tx.savingsMovementId
            ){

              const savingsIndex =
                state.savings.findIndex(
                  x=>
                    x.id ===
                    tx.savingsMovementId
                );


              if(
                savingsIndex >= 0
              ){

                state.savings.splice(
                  savingsIndex,
                  1
                );

              }

            }


            m.transactions.splice(
              i,
              1
            );


            save();

            render();

          }

        }
      );

    }
  );

}


/* =========================================================
   PÁGINA DE AHORROS
========================================================= */

function savingsPage(a){

  const balances =
    savingsAccountBalances();


  const totalExcludingSofi =
    savingsTotalExcludingSofi();


  const totalAll =
    savingsTotalAll();


  /*
    KPIs
  */

  const kpiHtml =
    savingsAccounts.map(
      account=>`

        <div class="kpi">

          <div class="label">

            ${esc(account)}

          </div>

          <div class="value">

            ${money(
              balances[account]
            )}

          </div>

        </div>

      `
    ).join("");


  /*
    Movimientos
  */

  const rows =
    state.savings.map(
      (x,i)=>`

        <tr>

          <td>

            <input
              type="date"
              value="${esc(x.date || "")}"
              data-savings="${i}"
              data-field="date">

          </td>


          <td>

            <input
              value="${esc(x.desc || "")}"
              placeholder="Descripción"
              data-savings="${i}"
              data-field="desc">

          </td>


          <td>

            <select
              data-savings="${i}"
              data-field="account">

              ${savingsAccounts.map(
                account=>`

                  <option
                    value="${esc(account)}"
                    ${
                      x.account === account
                      ? "selected"
                      : ""
                    }>

                    ${esc(account)}

                  </option>

                `
              ).join("")}

            </select>

          </td>


          <td>

            <select
              data-savings="${i}"
              data-field="type">

              ${savingsMovementTypes.map(
                type=>`

                  <option
                    value="${esc(type)}"
                    ${
                      x.type === type
                      ? "selected"
                      : ""
                    }>

                    ${esc(type)}

                  </option>

                `
              ).join("")}

            </select>

          </td>


          <td>

            <input
              type="number"
              step=".01"
              value="${Number(x.amount || 0)}"
              data-savings="${i}"
              data-field="amount">

          </td>


          <td>

            <input
              value="${esc(x.note || "")}"
              placeholder="Comentario"
              data-savings="${i}"
              data-field="note">

          </td>


          <td>

            ${
              x.transactionId

              ? `

                <span
                  class="small"
                  title="Origen: transacción mensual">

                  🔗

                </span>

              `

              : ""

            }


            <button
              class="danger"
              data-delete-savings="${i}">

              ×

            </button>

          </td>

        </tr>

      `
    ).join("");


  /*
    Saldo por cuenta
  */

  const balanceRows =
    savingsAccounts.map(
      account=>{

        const balance =
          balances[
            account
          ] || 0;


        return `

          <tr>

            <td>
              <b>
                ${esc(account)}
              </b>
            </td>

            <td
              class="num ${
                balance < 0
                ? "balance-negative"
                : "balance-positive"
              }">

              ${money(balance)}

            </td>

            <td>

              ${
                account ===
                "SoFi"

                ? "Excluida del total principal"

                : "Incluida"

              }

            </td>

          </tr>

        `;

      }
    ).join("");


  a.innerHTML = `

    <div class="toolbar">

      <button
        class="primary"
        id="addSavings">

        + Movimiento

      </button>

    </div>


    <!-- KPIs -->

    <div class="kpis">

      ${kpiHtml}

    </div>


    <!-- TOTAL PRINCIPAL -->

    <div
      class="card savings-total">

      <div class="card-header">

        <h2>
          TOTAL DE AHORROS
        </h2>

        <div
          style="font-size:26px;font-weight:700">

          ${money(
            totalExcludingSofi
          )}

        </div>

      </div>


      <div class="info">

        El total principal incluye
        <b>Marcus Miriam, Marcus Cesar,
        Bluevine ICM y OpenBank</b>.

        El saldo de <b>SoFi</b> se muestra
        por separado y queda excluido
        de este total.

      </div>


      <div>

        Total incluyendo SoFi:

        <b>
          ${money(totalAll)}
        </b>

      </div>

    </div>


    <!-- SALDOS -->

    <div
      class="card"
      style="margin-top:16px">

      <h2>
        SALDO POR CUENTA
      </h2>

      <table>

        <tr>

          <th>
            Cuenta
          </th>

          <th class="num">
            Saldo
          </th>

          <th>
            Tratamiento
          </th>

        </tr>

        ${balanceRows}

        <tr class="total">

          <td>
            TOTAL EXCLUYENDO SOFI
          </td>

          <td class="num">
            ${money(
              totalExcludingSofi
            )}
          </td>

          <td></td>

        </tr>

      </table>

    </div>


    <!-- MOVIMIENTOS -->

    <div
      class="card"
      style="margin-top:16px">

      <div class="card-header">

        <h2>
          MOVIMIENTOS DE AHORROS
        </h2>

        <div class="small">

          Depósito = suma ·
          Retiro = resta ·
          Intereses = suma

        </div>

      </div>


      <div class="info">

        Los movimientos que vienen de una
        transacción mensual aparecen aquí
        automáticamente cuando su categoría
        es <b>Ahorros</b>.

        Puedes seleccionar la cuenta y el
        tipo de movimiento mediante los
        menús desplegables.

      </div>


      <div class="transaction-table">

        <table>

          <tr>

            <th>
              Fecha
            </th>

            <th>
              Descripción
            </th>

            <th>
              Cuenta
            </th>

            <th>
              Tipo
            </th>

            <th>
              Importe
            </th>

            <th>
              Comentario
            </th>

            <th></th>

          </tr>

          ${
            rows ||

            `

              <tr>

                <td
                  colspan="7"
                  class="empty">

                  No hay movimientos
                  de ahorros.

                </td>

              </tr>

            `
          }


          <tr class="total">

            <td colspan="4">
              TOTAL EXCLUYENDO SOFI
            </td>

            <td class="num">

              ${money(
                totalExcludingSofi
              )}

            </td>

            <td colspan="2"></td>

          </tr>

        </table>

      </div>

    </div>

  `;


  /*
    Añadir movimiento
  */

  document
    .getElementById(
      "addSavings"
    )
    .addEventListener(
      "click",
      ()=>{

        state.savings.push({

          id:
            "sav-" +
            Date.now() +
            "-" +
            Math.random()
              .toString(36)
              .slice(2),

          transactionId:
            null,

          sourceMonth:
            null,

          date:
            new Date()
              .toISOString()
              .slice(0,10),

          desc:
            "",

          amount:
            0,

          account:
            "Marcus Miriam",

          type:
            "Depósito",

          note:
            ""

        });


        save();

        render();

      }
    );


  /*
    Cambios
  */

  a.querySelectorAll(
    "[data-savings]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.savings
            );


          const field =
            this.dataset.field;


          const movement =
            state.savings[i];


          if(!movement){
            return;
          }


          /*
            No permitimos cambiar algunos
            datos estructurales desde el
            movimiento si viene de una
            transacción.
          */

          if(
            field === "amount"
          ){

            movement.amount =
              Number(
                this.value
              ) || 0;

          }
          else{

            movement[field] =
              this.value;

          }


          /*
            Si está vinculado a una
            transacción, actualizamos
            también la transacción.
          */

          if(
            movement.transactionId
          ){

            const source =
              findTransactionById(
                movement.transactionId
              );


            if(source){

              if(
                field === "account"
              ){

                source.savingsAccount =
                  this.value;

              }


              if(
                field === "amount"
              ){

                source.amount =
                  Number(
                    this.value
                  ) || 0;

              }


              if(
                field === "date"
              ){

                source.date =
                  this.value;

              }


              if(
                field === "desc"
              ){

                source.desc =
                  this.value;

              }


              if(
                field === "note"
              ){

                source.note =
                  this.value;

              }


              /*
                El tipo se guarda en la
                transacción para conservarlo
                si la app vuelve a sincronizar.
              */

              if(
                field === "type"
              ){

                source.savingsType =
                  this.value;

              }

            }

          }


          save();

          render();

        }
      );

    }
  );


  /*
    Eliminar movimiento
  */

  a.querySelectorAll(
    "[data-delete-savings]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.deleteSavings
            );


          const movement =
            state.savings[i];


          if(!movement){
            return;
          }


          if(
            confirm(
              "¿Eliminar este movimiento de ahorros?"
            )
          ){

            /*
              Si viene de una transacción,
              quitamos el vínculo y
              mantenemos la transacción.
            */

            if(
              movement.transactionId
            ){

              const tx =
                findTransactionById(
                  movement.transactionId
                );


              if(tx){

                tx.savingsMovementId =
                  null;

              }

            }


            state.savings.splice(
              i,
              1
            );


            save();

            render();

          }

        }
      );

    }
  );

}


/* =========================================================
   BUSCAR TRANSACCIÓN
========================================================= */

function findTransactionById(
  id
){

  for(
    const monthName of months
  ){

    const found =
      state.months[
        monthName
      ].transactions.find(
        tx=>
          tx.id === id
      );


    if(found){

      return found;

    }

  }


  return null;

}


/* =========================================================
   TAXES
========================================================= */

function taxesPage(a){

  const totalsData =
    taxesTotals();


  const rows =
    state.taxes.map(
      (x,i)=>`

        <tr>

          <td>

            <input
              type="date"
              value="${esc(x.date || "")}"
              data-tax="${i}"
              data-field="date">

          </td>


          <td>

            <input
              value="${esc(x.desc || "")}"
              placeholder="Descripción"
              data-tax="${i}"
              data-field="desc">

          </td>


          <td>

            <select
              data-tax="${i}"
              data-field="category">

              ${taxesCategories.map(
                category=>`

                  <option
                    value="${esc(category)}"
                    ${
                      (
                        x.category ||
                        "Otros"
                      ) === category
                      ? "selected"
                      : ""
                    }>

                    ${esc(category)}

                  </option>

                `
              ).join("")}

            </select>

          </td>


          <td>

            <input
              type="number"
              step=".01"
              value="${Number(x.amount || 0)}"
              data-tax="${i}"
              data-field="amount">

          </td>


          <td>

            <input
              value="${esc(x.note || "")}"
              placeholder="Comentario"
              data-tax="${i}"
              data-field="note">

          </td>


          <td>

            <button
              class="danger"
              data-delete-tax="${i}">

              ×

            </button>

          </td>

        </tr>

      `
    ).join("");


  const categoryRows =
    taxesCategories.map(
      category=>`

        <tr>

          <td>
            ${esc(category)}
          </td>

          <td class="num">
            ${money(
              totalsData.byCategory[
                category
              ] || 0
            )}
          </td>

        </tr>

      `
    ).join("");


  a.innerHTML = `

    <div class="kpis">

      <div class="kpi">

        <div class="label">
          Total Taxes
        </div>

        <div class="value">
          ${money(
            totalsData.total
          )}
        </div>

      </div>

    </div>


    <div
      class="grid">

      <div class="card">

        <div class="card-header">

          <h2>
            TAXES
          </h2>

          <button
            class="primary"
            id="addTax">

            + Movimiento

          </button>

        </div>


        <table>

          <tr>

            <th>
              Fecha
            </th>

            <th>
              Descripción
            </th>

            <th>
              Categoría
            </th>

            <th>
              Importe
            </th>

            <th>
              Comentario
            </th>

            <th></th>

          </tr>

          ${
            rows ||

            `

              <tr>

                <td
                  colspan="6"
                  class="empty">

                  No hay movimientos de taxes.

                </td>

              </tr>

            `
          }


          <tr class="total">

            <td colspan="3">
              TOTAL TAXES
            </td>

            <td class="num">
              ${money(
                totalsData.total
              )}
            </td>

            <td colspan="2"></td>

          </tr>

        </table>

      </div>


      <div class="card">

        <h2>
          Resumen por categoría
        </h2>

        <table>

          <tr>

            <th>
              Categoría
            </th>

            <th class="num">
              Total
            </th>

          </tr>

          ${categoryRows}


          <tr class="total">

            <td>
              TOTAL
            </td>

            <td class="num">
              ${money(
                totalsData.total
              )}
            </td>

          </tr>

        </table>

      </div>

    </div>

  `;


  /*
    Añadir tax
  */

  document
    .getElementById(
      "addTax"
    )
    .addEventListener(
      "click",
      ()=>{

        state.taxes.push({

          id:
            "tax-" +
            Date.now(),

          date:
            new Date()
              .toISOString()
              .slice(0,10),

          desc:
            "",

          category:
            "Otros",

          amount:
            0,

          note:
            ""

        });


        save();

        render();

      }
    );


  /*
    Editar taxes
  */

  a.querySelectorAll(
    "[data-tax]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.tax
            );


          const field =
            this.dataset.field;


          if(
            !state.taxes[i]
          ){

            return;

          }


          state.taxes[i][field] =

            field === "amount"

            ? Number(
                this.value
              ) || 0

            : this.value;


          save();

          render();

        }
      );

    }
  );


  /*
    Eliminar taxes
  */

  a.querySelectorAll(
    "[data-delete-tax]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.deleteTax
            );


          if(
            confirm(
              "¿Eliminar este movimiento de taxes?"
            )
          ){

            state.taxes.splice(
              i,
              1
            );


            save();

            render();

          }

        }
      );

    }
  );

}


/* =========================================================
   TO DO
========================================================= */

function todo(a){

  const rows =
    state.todo.map(
      (x,i)=>`

        <tr>

          <td
            style="width:50px">

            <input
              type="checkbox"
              ${
                x.done
                ? "checked"
                : ""
              }
              data-todo-check="${i}">

          </td>


          <td>

            <input
              value="${esc(x.text || "")}"
              data-todo-text="${i}">

          </td>


          <td>

            <button
              class="danger"
              data-delete-todo="${i}">

              ×

            </button>

          </td>

        </tr>

      `
    ).join("");


  a.innerHTML = `

    <div class="toolbar">

      <button
        class="primary"
        id="addTodo">

        + Tarea

      </button>

    </div>


    <div class="card">

      <h2>
        TO DO
      </h2>

      <table>

        <tr>

          <th
            style="width:50px"></th>

          <th>
            Tarea
          </th>

          <th></th>

        </tr>

        ${
          rows ||

          `

            <tr>

              <td
                colspan="3"
                class="empty">

                No hay tareas.

              </td>

            </tr>

          `
        }

      </table>

    </div>

  `;


  document
    .getElementById(
      "addTodo"
    )
    .addEventListener(
      "click",
      ()=>{

        state.todo.push({

          text:
            "Nueva tarea",

          done:false

        });


        save();

        render();

      }
    );


  a.querySelectorAll(
    "[data-todo-check]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.todoCheck
            );


          state.todo[i].done =
            this.checked;


          save();

          render();

        }
      );

    }
  );


  a.querySelectorAll(
    "[data-todo-text]"
  ).forEach(
    input=>{

      input.addEventListener(
        "change",
        function(){

          const i =
            Number(
              this.dataset.todoText
            );


          state.todo[i].text =
            this.value;


          save();

        }
      );

    }
  );


  a.querySelectorAll(
    "[data-delete-todo]"
  ).forEach(
    button=>{

      button.addEventListener(
        "click",
        function(){

          const i =
            Number(
              this.dataset.deleteTodo
            );


          state.todo.splice(
            i,
            1
          );


          save();

          render();

        }
      );

    }
  );

}


/* =========================================================
   EXPORTAR
========================================================= */

function downloadBackup(){

  const blob =
    new Blob(
      [
        JSON.stringify(
          state,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    "CM_Finanzas_2026_backup.json";


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   IMPORTAR
========================================================= */

function importBackup(e){

  const file =
    e.target.files[0];


  if(!file){
    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function(){

      try{

        const imported =
          JSON.parse(
            reader.result
          );


        if(
          !imported ||
          !imported.months
        ){

          throw new Error(
            "El archivo no tiene un formato válido."
          );

        }


        /*
          Aseguramos estructuras nuevas.
        */

        if(
          !imported.savings
        ){

          imported.savings=[];

        }


        if(
          !imported.taxes
        ){

          imported.taxes=[];

        }


        if(
          !imported.recurring
        ){

          imported.recurring=[];

        }


        if(
          !imported.todo
        ){

          imported.todo=[];

        }


        state =
          imported;


        /*
          Normalización.
        */

        months.forEach(
          monthName=>{

            if(
              !state.months[
                monthName
              ]
            ){

              state.months[
                monthName
              ] =
                createDefaultMonth();

            }


            if(
              !state.months[
                monthName
              ].transactions
            ){

              state.months[
                monthName
              ].transactions=[];

            }


            if(
              !state.months[
                monthName
              ].budgets
            ){

              state.months[
                monthName
              ].budgets={};

            }


            /*
              Garantizamos Ahorros.
            */

            if(
              state.months[
                monthName
              ].budgets.Ahorros ===
              undefined
            ){

              state.months[
                monthName
              ].budgets.Ahorros=0;

            }

          }
        );


        save();

        render();


      }catch(error){

        alert(
          "Archivo JSON no válido.\n\n" +
          error.message
        );

      }

    };


  reader.readAsText(
    file
  );

}


/* =========================================================
   RESTABLECER
========================================================= */

function resetData(){

  if(
    confirm(
      "Esto borrará los datos guardados en este navegador y restaurará la plantilla. ¿Continuar?"
    )
  ){

    localStorage.removeItem(
      "cmFinanzas2026"
    );


    state =
      structuredClone(
        defaultState
      );


    save();

    render();

  }

}


/* =========================================================
   ARRANQUE
========================================================= */

syncAllSavingsTransactions();

save();

render();

</script>