$(function () {
    let layer = layui.layer;
    let form = layui.form;

    template.defaults.imports.dateFormat = function (date) {
        let dt = new Date(date);
        let y = Zero(dt.getFullYear());
        let m = Zero(dt.getMonth() + 1);
        let d = Zero(dt.getDay());

        let hh = Zero(dt.getHours());
        let mm = Zero(dt.getMinutes());
        let ss = Zero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
    }

    function Zero(time) {
        return time < 10 ? '0' + time : time;
    }

    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initForm();

    function initForm() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: p,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }

                let htmlStr = template("cateList", {
                    data: res.data
                });
                $("tbody").html(htmlStr);
                renderPage(res.total)
            }
        })
    }

    initSelect();

    function initSelect() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                let htmlStr = template("selectForm", {
                    data: res.data
                });
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    $("#filterForm").on("submit", function (e) {
        e.preventDefault();
        // console.log('ok');
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();

        p.cate_id = cate_id;
        p.state = state;

        initForm();
    })

    let laypage = layui.laypage;

    function renderPage(total) {
        // ????????????laypage??????
        laypage.render({
            elem: 'pageList', //?????????????????? test1 ??? ID???????????? # ???
            count: total, //?????????????????????????????????
            curr: p.pagenum,
            limit: p.pagesize,
            jump: function (obj, first) {
                //obj????????????????????????????????????????????????
                // console.log(obj.curr); //???????????????????????????????????????????????????????????????
                // console.log(obj.limit); //???????????????????????????

                //???????????????
                if (!first) {
                    //do something
                    p.pagenum = obj.curr;
                    p.pagesize = obj.limit;

                    initForm();
                }
            }
        });
    }

    $("tbody").on("click", ".btn-del", function () {
        // console.log(this);
        let Id = $(this).attr("data-id");
        layer.confirm('?????????????????????????????????', {
            icon: 3,
            title: '??????'
        }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                method: 'GET',
                dataType: 'json',
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message, {
                            icon: 5
                        });
                    }
                    layer.msg(res.message, {
                        icon: 6
                    });
                    if ($(".btn-del").length === 1 && p.pagenum > 1) p.pagenum--;
                    initForm();
                }
            })

            layer.close(index);
        });
    })

})