const form = document.querySelector('form')
const ul = document.querySelector('ul')
const button = document.querySelector('.btn')
const input = document.getElementById('task')
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []

var data = JSON.parse(localStorage.getItem('items'))
//if already data exists render data
if(data){
  data.forEach(item => {
    const li = document.createElement('li')
    li.innerHTML = '<div class="mark '+ (item.status?' done':'') +'"></div>' + item.msg;
    if(item.status){
      li.className="fade";
    }
    else{
      li.className="";
    }
    ul.appendChild(li)  
  });    
}


function liMaker(text){
  const li = document.createElement('li')
  li.innerHTML = '<div class="mark '+ (text.status?' done':'') +'"></div>' + text.msg;
  if(text.status){
    li.className="fade";
  }
  else{
    li.className="";
  }
  ul.insertBefore(li,ul.firstChild)
}




form.addEventListener('submit', function(e) {
  e.preventDefault()

  if(input.value){   
    itemsArray.splice(0,0,{"msg":input.value,"status":false})
    localStorage.setItem('items', JSON.stringify(itemsArray))
    liMaker({"msg":input.value,"status":false}  )
    input.value = ''
    ul.scrollTop = 0;
  }
})


button.addEventListener('click', function() {
  Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Clear All!'
      }).then(res => {
    if(res.value){
      Swal.fire("Cleared!","Your todo list has been cleared.!","success");
      localStorage.clear()
      data = [];
      itemsArray = []
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
      }
    }
  });
})

// $(document).ready(function(){
//   $('form').submit(function(){
//     $(".mark").click(function(){
//       $(this).toggleClass("done");
//       $(this).parent().toggleClass("fade");
//     });
//   });
// });


$(document).ready(function(){
  $(".mark").click(function(){
    $(this).toggleClass("done");
    $(this).parent().toggleClass("fade");
    if($(this).attr('class') == "mark done"){
      console.log($(this).parent().index())
      x = itemsArray.splice($(this).parent().index(),1);
      x=x[0];
      console.log(x);
      x.status=true;
      itemsArray.push(x);
      localStorage.setItem('items', JSON.stringify(itemsArray))
      
      //Remove element from current position and add at last pos
      $(this).parent().remove()
      const lid = document.createElement('li')
      lid.innerHTML = '<div class="mark done"></div>' + x.msg;
      lid.className="fade";
      ul.appendChild(lid) 

    }
    else{
      console.log($(this).parent().index())
      x = itemsArray.splice($(this).parent().index(),1);
      x=x[0];
      console.log(x);
      x.status=false;
      itemsArray.splice(0,0,x);
      localStorage.setItem('items', JSON.stringify(itemsArray))
      
      //Remove element from current position and add at first pos
      $(this).parent().remove()
      const lid = document.createElement('li')
      lid.innerHTML = '<div class="mark"></div>' + x.msg;
      lid.className="";
      ul.insertBefore(lid,ul.firstChild);

    }
  });
});
