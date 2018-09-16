
(function(window){
  var tl={};
  tl.msg={};
  tl.msg.url1="http://192.168.43.133/api/"
  tl.msg.url="http://backend.trealent.com/api/";
  tl.msg.appkey="cpj2xarlc710n";
  tl.msg.appsecret="gmutBFXfwGd1";
  tl.msg.RcToken;


  tl.msg.getRCToken = function(){
      if($api.getStorage('trealent_user_token')){
        var user_id=$api.getStorage("trealent_user_id");
        var user_token=$api.getStorage("trealent_user_token");
        api.ajax({
            url: tl.msg.url+"message/get_rongcloud_token",
            method: 'post',
            data: {
                values: {
                    uid:user_id,
                    utoken:user_token
                },
            }
        },function(ret, err){
            if(ret&&ret.code==200){
            //tl.msg.RcToken=ret.data.token;
              $api.setStorage('rongToken',ret.data.token);
            }
            else if(ret&&ret.code==401){
              api.toast({
                  msg: ret.msg,
                  duration: 2000,
                  location: 'bottom',
                  global:true
              });
            }
          else {
            api.toast({
                msg: '网络错误',
                duration: 2000,
                location: 'bottom',
                global:true
            });

          }
        });
    }
  }

  tl.msg.rongInit=function(){
    var rong = api.require('rongCloud2');
    rong.init(function(ret, err) {
        if (ret.status == 'error')
            api.toast({ msg: err.code });
    });
  }

  tl.msg.rongConnect=function(){
    var rong = api.require('rongCloud2');
    rong.connect({token: $api.getStorage("rongToken")},function(ret, err) {
        if (ret.status == 'success') api.toast({ msg: ret.result.userId,global:true,duration:2000});
    });
  }

  tl.msg.rongSetListener=function(func){
    var rong = api.require('rongCloud2');
    rong.setOnReceiveMessageListener(function(ret, err) {
        api.toast({ msg: JSON.stringify(ret.result.message)});
        api.toast({ msg: ret.result.message.left});
        func(ret,err);
    });
  }


  window.tlMsg=tl;
})(window);
