/*          PAGINATION 
- on change max rows select options fade out all rows gt option value mx = 5
- append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
- each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
- fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
- fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
*/
   
function Pagination (table, maxRows, crochetObject){
  this.table = table;
  this.lastPage = 1;
  this.maxRows = maxRows;
  this.totalRows = 0;
  this.$pagination = document.getElementById('pagination');
  this.crochetObject = crochetObject;

  this.init();
}

Pagination.prototype = {
  init: function() {
    this.setupHandlers().setupEvents();
  },

  setupHandlers: function() {
    this.updatePageHandler = this.updatePage.bind(this);
    return this;
  },

  setupEvents: function() {
    this.$pagination.addEventListener('click', this.updatePageHandler);
    return this;
  },

  setRows: function(data) {
    var tableObject = document.getElementById(this.table).tBodies[0];

    while (tableObject.rows.length > 0) {
      tableObject.deleteRow(0);
    }

    for (var i = 0; i < data.length; i++) {
      var rowClass = (i % 2 == 0) ? 'even' : 'odd';
      var row = document.createElement('tr');
      var container = document.createElement('label');
      var checkmark = document.createElement('span');
      var input = document.createElement('input');
      var checkedColumn = document.createElement('td');
      var groupNameColumn = document.createElement('td');
      var groupValueColumn = document.createElement('td');

      var group = data[i];

      row.classList.add(rowClass);
      checkmark.classList.add('checked');
      container.classList.add('container');

      input.type = 'checkbox';
      input.name = group.key;
      input.id = i;
      input.checked = this.crochetObject.hasGroup(group.key);
      input.addEventListener('change', this.crochetObject.groupChangeHandler)
      groupNameColumn.innerText = group.key;
      groupValueColumn.innerText = group.value[0];

      container.appendChild(input)
      container.appendChild(checkmark)
      checkedColumn.appendChild(container);

      row.appendChild(checkedColumn)
      row.appendChild(groupNameColumn);
      row.appendChild(groupValueColumn);

      tableObject.appendChild(row);
    }
    return this
  },

  getPagination: function() {
    this.lastPage = 1 ; 
    var count = this.$pagination.childElementCount;
    var rows = document.getElementById(this.table).tBodies[0].rows;    // all of the rows 

    for (var i = 1; i < count-1; i++) {
      this.$pagination.removeChild(this.$pagination.children[1]);
    }
    var trnum = 0 ;                 // reset tr counter 

    if(this.maxRows == -1 ){
      this.$pagination.style.display = "none";
    }else {
      this.$pagination.style.display = "block";
    }

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var row = rows[rowIndex];
      trnum++;      if (trnum > this.maxRows) {
        row.style.display = "none";
      } else {
        row.style.display = "table-row";
      }
    }
                         //  was fade out to fade it in 
    if (rows.length > this.maxRows){            // if tr total rows gt max rows option
      var pagenum = Math.ceil(rows.length/this.maxRows); // ceil total(rows/maxrows) to get numbers of pages 
      
      this.$pagination.classList.remove('hidden');

      for (var i = 1; i <= pagenum ; ){      // for each page append pagination li 
        var element = document.createElement('li');
        element.setAttribute('data-page', i);
        if (i == 1) {
          element.classList.add('active'); // add active class to the first li 
        }
        element.innerHTML = '<span>'+ i++ +'<span class="sr-only">(current)</span></span>'
        this.$pagination.insertBefore(element, this.$pagination.children[this.$pagination.childElementCount - 1])
      }                     // end for i  // end if row count > max rows
    } else {
      this.$pagination.classList.add('hidden');
    }
                        
    return this
  },

  updatePage: function(e) {
    var element = e.path[1] // get LI
    var pageNum = element.attributes['data-page'].value;
    var rows = document.getElementById(this.table).tBodies[0].rows;    // all of the rows 
    var trnum = 0;

    if (rows.length > this.maxRows) {

      if(pageNum == "prev" ){
        if(this.lastPage == 1 ){return this;}
        pageNum  = --this.lastPage ; 
      }
      if(pageNum == "next" ){
        if(this.lastPage == (this.$pagination.children.length -2) ){return this;}
        pageNum  = ++this.lastPage ; 
      }

      this.lastPage = pageNum ;
      var trIndex = 0 ;             // reset tr counter
      document.querySelectorAll('#pagination li').forEach(function(e) {e.classList.remove('active')});  // remove active class from all li 
      document.querySelector('.pagination [data-page="'+this.lastPage+'"]').classList.add('active');// add active class to the clicked 
      for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        var row = rows[rowIndex];
        trnum++;      
        if (trnum > (this.maxRows*pageNum) || trnum <= (this.maxRows*(pageNum-1))) {
          row.style.display = "none";
        } else {
          row.style.display = "table-row";
        }
      } // end of for each tr in table
    }
    return this                 // end of on click pagination list
            
  },
}// END OF PAGINATION 
  

//  Developed By Yasser Mas 
// yasser.mas2@gmail.com
// updated by Mikhaila Friske

