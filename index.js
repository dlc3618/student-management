var tableData = [];
var pageSize = 8;
var curPage = 1;
//绑定事件
function bindEvent() {
    //左侧菜单栏点击事件，切换样式及右侧内容区
    $('.left-menu > dl').on('click', 'dd', function () {
        var id = $(this).attr('data-id');
        if ( id == 'student-list') {
            getTableData();
        }
        $('.left-menu dl > .active').removeClass('active');
        $(this).addClass('active');
        $('.content').fadeOut();
        $('.' + id).fadeIn();
    });
    //新增学生的提交事件
    $('#add-submit').click(function (e) {
        e.preventDefault();
        var data = getFormData($('#addStudenForm'));
        // console.log(data);
        transferData('/api/student/addStudent', data, function (res) {
            // console.log(res);
            if (res.status == 'success') {
                // console.log($('#addStudenForm')[0])
                alert('新增成功');
                $('#addStudenForm')[0].reset();
                $('.left-menu > dl > dd[data-id="student-list"]').trigger('click') ;
            }
        } )
    });
    //编辑学生的提交事件
    $('#edit-submit').click(function (e) {
       
        e.preventDefault();
        var data = getFormData($('#editStudentForm'));
        // console.log(data);
        transferData('/api/student/updateStudent', data, function (res) {
            // console.log(res);
            if (res.status == 'success') {
                // console.log($('#addStudenForm')[0])
                alert('修改成功！');
                $('#editStudentForm')[0].reset();
                $('.model').slideUp();
                $('.left-menu > dl > dd[data-id="student-list"]').trigger('click') ;
            }
        } )
    });
    //搜索的点击事件
    $('#search-submit').click(function (e) {
        var value = $('#search-word').val();
        if(value) {
            curPage = 1;
            getFilterData(value);
        }else {
            getTableData();
        }
    })
   
}
function getFilterData(value) {
    transferData('/api/student/searchStudent', {
        sex: -1,
        search: value,
        page: curPage,
        size: pageSize
    },function(res) {
        console.log(res);
        if(res.status == 'success') {
            tableData = res.data.searchList;
            var allPage = Math.ceil(res.data.cont / pageSize);
            $('#turn-page').turnPage({
                curPage: curPage,
                allPage: allPage,
                changePage: (page) => {
                    curPage = page;
                    getFilterData();
                }
            })
            renderTable(res.data.searchList);
        }
    })
}
//绑定表单事件
function bindTableEvent(e) {
    //编辑按钮的点击事件
    $('.edit').click(function(e) {
        console.log(e.target);
        var index = $(this).attr('data-index');
        $('.model').slideDown();
        renderEditForm(tableData[index]);
    });
    //弹框的显示与消失
    $('.model > .model-content').click(function(e) {
        //阻止冒泡
        e.stopPropagation();
    });
    $('.model').click(function(e) {
        $('.model').slideUp();
    });
    //删除按钮的点击事件
    $('.del').click(function(e) {
        var index = $(this).attr('data-index');
        var isDel = window.confirm('确认删除？');
        if (isDel) {
            transferData('/api/student/delBySno', {
                sNo: tableData[index].sNo,
            }, function (res) {
                if (res.status == 'success') {
                    alert('删除成功！')
                    $('.left-menu > dl > dd[data-id="student-list"]').trigger('click');
                }
            })
        }
       
    })
}
//获取表单数据
function getFormData(dom) {
    var data = $(dom).serializeArray();
    // console.log(data);
    var result = {};
    data.forEach(function (item, index) {
        result[item.name] = item.value;
    });     
    return result;
}
//获取接口数据
function getTableData() {
    transferData('/api/student/findByPage', {
        page: curPage,
        size: pageSize
    },function(res) {
        console.log(res);
        if(res.status == 'success') {
            tableData = res.data.findByPage;
            //取值allPage
            var allPage = Math.ceil(res.data.cont / pageSize);
            $('#turn-page').turnPage({
                curPage: curPage,
                allPage: allPage,
                changePage: (page) => {
                    curPage = page;
                    getTableData();
                }
            })
            renderTable(res.data.findByPage);
        }
    })
}

//渲染表单数据
function renderTable(data) {
    var str = '';
    data.forEach(function (item, index) {
        str += '<tr>\
        <td>'+ item.sNo +'</td>\
        <td>'+ item.name +'</td>\
        <td>'+ (item.sex ? '女' : '男') +'</td>\
        <td>'+ item.email +'</td>\
        <td>'+ (new Date().getFullYear() - item.birth) +'</td>\
        <td>'+ item.phone +'</td>\
        <td>'+ item.address +'</td>\
        <td>\
            <button class="btn edit" data-index='+ index +'>编辑</button>\
            <button class="btn del" data-index='+ index +'>删除</button>\
        </td>\
    </tr>'  
    });
    $('.student-list > table > tbody').html(str);
    bindTableEvent();
}
//数据编辑回填
function renderEditForm(data) {
    var editForm = $('#editStudentForm')[0];
    for (var prop in data) {
        console.log(editForm);
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}
//ajax数据请求
function transferData(url, data, cb) {
    $.ajax({
        url: 'http://api.duyiedu.com' + url,
        type: 'GET',
        data: {
            appkey: 'dlc3618_1551448104459',
            ...data,
        },
        dataType: 'json',
        success: function (res) {
            cb(res);
        }
        
    })
}
//初始化
function init() {
    bindEvent();
    $('.left-menu > dl > dd[data-id="student-list"]').trigger('click');
}
init();