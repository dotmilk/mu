import { MuPagedCollection, MuTable, muInjectCss } from '@dotmilk/mu'
muInjectCss()
let rows = new MuPagedCollection({
    idField: 'id',
    pageSize: 4
})

let tableTest = new MuTable({
    headers: {
        firstName: 'First Name',
        lastName: 'Last Name',
        age: 'Age'
    },
    headerKeys: ['firstName','lastName','age'],
    rows: rows,
    markSelection: true,
    fixedPageSize: true
})

/* rows.add({id: 1, firstName: 'Seth', lastName: 'Smith', age: 23})
 * rows.add({id: 2, firstName: 'Jim', lastName: 'Simmons', age: 23})
 * rows.add({id: 3, firstName: 'Bob', lastName: 'Stokely', age: 26})
 * rows.add({id: 4, firstName: 'Scott', lastName: 'Williams', age: 19})
 * rows.add({id: 5, firstName: 'Bill', lastName: 'Johnson', age: 18})
 * rows.add({id: 6, firstName: 'Steve', lastName: 'Jones', age: 29})
 * rows.add({id: 7, firstName: 'Jeff', lastName: 'Brown', age: 19})
 * rows.add({id: 8, firstName: 'Sean', lastName: 'Davis', age: 23})
 * rows.add({id: 9, firstName: 'Jimmy', lastName: 'Miller', age: 22})
 * rows.add({id: 10, firstName: 'Eric', lastName: 'Wilson', age: 17})
 */

rows.add([{id: 1, firstName: 'Seth', lastName: 'Smith', age: 23},
          {id: 2, firstName: 'Jim', lastName: 'Simmons', age: 23},
          {id: 3, firstName: 'Bob', lastName: 'Stokely', age: 26},
          {id: 4, firstName: 'Scott', lastName: 'Williams', age: 19},
          {id: 5, firstName: 'Bill', lastName: 'Johnson', age: 18},
          {id: 6, firstName: 'Steve', lastName: 'Jones', age: 29},
          {id: 7, firstName: 'Jeff', lastName: 'Brown', age: 19},
          {id: 8, firstName: 'Sean', lastName: 'Davis', age: 23},
          {id: 9, firstName: 'Jimmy', lastName: 'Miller', age: 22},
          {id: 10, firstName: 'Eric', lastName: 'Wilson', age: 17}])
document.querySelector('body').appendChild(tableTest.view.el)
tableTest.on('selection',(id)=>{
    console.log(`id:${id} selected ${JSON.stringify(rows.get(id))}`)
})

window.tableTest = tableTest
