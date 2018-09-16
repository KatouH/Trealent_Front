/**
 * aui-pull-refresh.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window) {
    var nowActiveItem = null;
    var inAnimation = false;
    listSwipe.prototype.options = {
        container:''
    };
    listSwipe.prototype.clearActive = function(){
        nowActiveItem = null;
    }
    listSwipe.prototype._init = function(options) {
        extend(this.options, options);
        if(!this.options.container){
            return;
        }
        this.container = this.options.container;
        $(this.container).find('.aui-list-swipe-box').each(function(index,el){
            $(el).css({right: -$(el).width()});
        });
        $(this.container).find('.aui-list-swipe-item').on('touchstart', function(e) {
            if(inAnimation == true){
                return;
            }
            var obj = e.currentTarget;
            if(!$(obj).hasClass("aui-list-swipe-item")){
                return;
            }

            var boxWidth = $(obj).find('.aui-list-swipe-box').width();
            var initX = event.targetTouches[0].pageX;
            var initY = event.targetTouches[0].pageY;
            var objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;

            if(nowActiveItem!=null && nowActiveItem!=obj){
                console.log($(this.container).find(nowActiveItem).length);
                inAnimation = true;
                var nowActiveItem_objX = (nowActiveItem.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                event.preventDefault();
                $(nowActiveItem).animate({
                    deg: 100
                }, {
                    step: function(n, fx) {
                        nowActiveItem.style.WebkitTransform = "translateX(" + (nowActiveItem_objX +(0-nowActiveItem_objX)*fx.pos) + "px)";
                    },
                    duration:200,
                    complete:function(){
                        inAnimation = false;
                        nowActiveItem = null;
                    }
                });
                return;
            }else{
                nowActiveItem = obj;
            }
            if(inAnimation == true){
                return;
            }
            var swipestate = false;
            $(obj).on('touchmove',function(e){
                var obj = e.currentTarget;
                if(!$(obj).hasClass("aui-list-swipe-item")){
                    return;
                }
                var moveX = event.targetTouches[0].pageX;
                var moveY = event.targetTouches[0].pageY;

                var X = moveX - initX;
                var Y = moveY - initY;
                if(swipestate){
                    event.preventDefault();
                }else{
                    if(Math.abs(X)<5 || Math.abs(Y)>10){
                        return;
                    }
                    if(Math.abs(Y)<10 || Math.abs(X)>20){
                        event.preventDefault();
                        swipestate = true;
                    }else{
                        $(obj).stop();
                    }
                }


               var nowPos = objX + X;
               if(nowPos < -boxWidth){
                    var signPos = (nowPos + boxWidth)/Math.abs(nowPos + boxWidth);
                    nowPos = -boxWidth + signPos*3.5*Math.sqrt(Math.abs(nowPos + boxWidth))
               }else if(nowPos > 0){
                    nowPos = 3.5*Math.sqrt(Math.abs(nowPos))
               }
               obj.style.WebkitTransform = "translateX(" + nowPos + "px)";
            });
            $(obj).on('touchend',function(e){
                var obj = e.currentTarget;
                if(!$(obj).hasClass("aui-list-swipe-item")){
                    return;
                }
                var objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                if(objX < -boxWidth/2){
                    inAnimation = true;
                    $(obj).animate({
                        deg: 100
                    }, {
                        step: function(n, fx) {
                            obj.style.WebkitTransform = "translateX(" + (objX +(-boxWidth-objX)*fx.pos) + "px)";
                        },
                        duration:200,
                        complete:function(){
                            inAnimation = false;
                        }
                    });
                }else{
                    inAnimation = true;
                    $(obj).stop();
                    $(obj).animate({
                        deg: 100
                    }, {
                        step: function(n, fx) {
                            obj.style.WebkitTransform = "translateX(" + (objX +(0-objX)*fx.pos) + "px)";
                        },
                        duration:200,
                        complete:function(){
                            inAnimation = false;
                            nowActiveItem = null;
                        }
                    });
                }

               $(obj).off('touchmove');
                $(obj).off('touchend');
            });


        });
    }

    function extend (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }
    function listSwipe (options) {
        this._init(options);
    }
    window.listSwipe = listSwipe;

})(window);
