(function() {

    function TurnPage(options) {
        this.wrap = options.wrap;
        this.curPage = options.curPage;
        this.allPage = options.allPage;
        this.changePage = options.changePage;
        this.fillHTML();
        this.bindEvent();
    }
    

    TurnPage.prototype.fillHTML = function () {
        //初始化（清空）
        $(this.wrap).empty();
        //添加上一页按钮
        if(this.curPage > 1) {
            $(this.wrap).append($('<li class="prev-page">上一页</li>'))
        }else {
            $(this.wrap).remove('.prev-page')
        }
        //展示第一页
        if(this.curPage - 2 > 1) {
            $(this.wrap).append($('<li class="tabNumber">1</li>'))
        }
        //展示左省略号
        if(this.curPage - 2 > 2) {
            $(this.wrap).append($('<span>...</span>'))
        }
        //展示当前页左右两边
        for(var i = this.curPage - 2; i <= this.curPage + 2; i++) {
            if(i > 0 & i <= this.allPage) {
                if(i == this.curPage) {
                    $(this.wrap).append($('<li class="tabNumber cur-page">' + i + '</li>'));
                }else{
                    $(this.wrap).append($('<li class="tabNumber">' + i + '</li>')); 
                }
                
            }
        }
         //展示右省略号
         if(this.curPage + 2 < this.allPage - 1) {
            $(this.wrap).append($('<span>...</span>'))
        }
         //展示最后一页
         if(this.curPage + 2 < this.allPage) {
            $(this.wrap).append($('<li class="tabNumber">' + this.allPage + '</li>'))
        }
       
        //添加下一页按钮
        if(this.curPage < this.allPage) {
            $(this.wrap).append($('<li class="next-page">下一页</li>'))
        }else {
            $(this.wrap).remove('.next-page')
        }
    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        //上一页按钮点击事件
        $('.prev-page', this.wrap).click(function(e) {
            if(self.curPage > 1) {
                self.curPage --;
                self.change();
            }

        })
        //下一页按钮点击事件
        $('.next-page', this.wrap).click(function(e) {
            if(self.curPage < self.allPage) {
                self.curPage ++;
                self.change();
            }

        })
        //随机点击事件
        $('.tabNumber').click(function(e) {
            // console.log($(this).text())
            self.curPage = parseInt($(this).text());
            self.change();
        })
    }
    TurnPage.prototype.change = function () {
        this.fillHTML();
        //重新绑定事件
        this.bindEvent();
        this.changePage(this.curPage);
    }
    $.fn.extend({
        turnPage: function(options) {
            //保存插入位置
            options.wrap = this;

            new TurnPage(options);

            //防止链式调用被影响
            return this;
        }
    })
}())