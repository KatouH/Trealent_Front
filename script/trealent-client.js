(function(window){
  var tl = {};
  tl.url = {};
  tl.url.test1="http://192.168.43.133/api/";
  tl.url.test="http://backend.trealent.com/api/";
  tl.user = {};
  tl.user.tool={};
  tl.task={};


      function fetchData(cname,method,data,func){
        if(typeof func == "undefined"){
            func = data;
            data = undefined;
        }
        api.ajax({
            url: tl.url.test+cname+"/"+method,
            timeout: 10,
            method:'post',
            data: data,
        },func);
      }


      tl.user.login = function(username, password ,func){
        fetchData('user','login',{values:{username: username,password: password }}, function(ret,err){
          if(ret&&ret.code==200){
          $api.setStorage("trealent_user_id", ret.data.id);
          $api.setStorage("trealent_user_username", ret.data.username);
          $api.setStorage("trealent_user_type", ret.data.type);
          $api.setStorage("trealent_user_token", ret.data.token);
        }
        console.log(err);
          func(ret,err);
        })
      }

      tl.user.logout = function(){
        if($api.getStorage('trealent_user_token')){
          var user_id=$api.getStorage("trealent_user_id");
          var user_token=$api.getStorage("trealent_user_token");
          fetchData('user','logout',{values:{uid:user_id,utoken:user_token}},function(ret,err){
            if(ret&&ret.code==200){
              api.toast({
                  msg: ret.msg,
                  duration: 2000,
                  global:true
              });
              $api.rmStorage("trealent_user_id");
              $api.rmStorage("trealent_user_username");
              $api.rmStorage("trealent_user_type");
              $api.rmStorage("trealent_user_token");
              $api.rmStorage('trealent_user_phone_num');
              $api.rmStorage('trealent_user_gender');
              $api.rmStorage('trealent_user_mail');
              $api.rmStorage('trealent_user_birthday');
              $api.rmStorage('trealent_user_signature');
              $api.rmStorage('trealent_user_avatar');
              $api.rmStorage('trealent_user_local_avatar');
              $api.rmStorage('trealent_user_type');
              $api.rmStorage('trealent_user_real_name');
              $api.rmStorage('trealent_user_credit');
              $api.rmStorage('trealent_user_last_active_time');

              $api.rmStorage('rongToken');

              api.rebootApp();
            }
          });
        }
      }


      tl.user.getprofile = function(){
        if($api.getStorage('trealent_user_token')){
          var user_id=$api.getStorage("trealent_user_id");
          var user_token=$api.getStorage("trealent_user_token");
          fetchData('user','profile',{values:{uid:user_id,utoken:user_token}},function(ret,err){
            if(ret&&ret.code==200){
            $api.setStorage('trealent_user_gender', ret.data.gender);
            $api.setStorage('trealent_user_avatar', ret.data.avatar);
            $api.setStorage('trealent_user_signature', ret.data.signature);
            $api.setStorage('trealent_user_mail', ret.data.mail);
            $api.setStorage('trealent_user_birthday', ret.data.birthday);
            $api.setStorage('trealent_user_type', ret.data.type);
            $api.setStorage('trealent_user_real_name', ret.data.real_name);
            $api.setStorage('trealent_user_phone_num', ret.data.phone_num);
            $api.setStorage('trealent_user_credit',ret.data.credit);
            $api.setStorage('trealent_user_last_active_time',ret.data.last_active_time);
          }
          });
        }
      }

      tl.user.getotherprofile = function(otherId,func){
        if($api.getStorage('trealent_user_token')){
          var user_id=$api.getStorage("trealent_user_id");
          var user_token=$api.getStorage("trealent_user_token");
          fetchData('user','profile',{values:{uid:user_id,utoken:user_token,id:otherId}},function(ret,err){
            if(ret&&ret.code==200){
              func(ret.data,err);
            }
          });
        }
      }

      tl.user.editprofile = function(ChgData,func){
          if($api.getStorage('trealent_user_token')){
            var user_id=$api.getStorage("trealent_user_id");
            var user_token=$api.getStorage("trealent_user_token");
            fetchData('user','edit_profile',ChgData,function(ret,err){
              func(ret,err);
            });
          }
        }

      tl.user.tool.mergeJsonObject=function(jsonbject1, jsonbject2) {
            var resultJsonObject={};
            for(var attr in jsonbject1){
              resultJsonObject[attr]=jsonbject1[attr];
            }
            for(var attr in jsonbject2){
              resultJsonObject[attr]=jsonbject2[attr];
            }
            return resultJsonObject;
      };

      tl.user.tool.getTaskCounts=function(func){
        if($api.getStorage('trealent_user_token')){
          var user_id=$api.getStorage("trealent_user_id");
          var user_token=$api.getStorage("trealent_user_token");
          fetchData('task','get_counts',{values:{uid:user_id,utoken:user_token}},function(ret,err){
            if(ret&&ret.code==200){
              func(ret,err);
            }
          });
        }
      }



      tl.task.creatTask=function(title,desc,content,typeId,requireMemberNum,signUpTime,finishDeadline,rewardAmount,func){
        if($api.getStorage('trealent_user_token')){
          var user_id=$api.getStorage("trealent_user_id");
          var user_token=$api.getStorage("trealent_user_token");
          var data={
            uid:user_id,
            utoken:user_token,
            title:title,
            desc:desc,
            type_id:typeId,
            content:content,
            require_member_num:requireMemberNum,
            sign_up_deadline:signUpTime,
            finish_deadline:finishDeadline,
            reward_amount:rewardAmount
          }
          fetchData('task','create_new_task',{values:data},function(ret,err){
            func(ret,err);
          })
        }
      }

      tl.task.get_task_list=function(type,page,func){
        if(typeof func == "undefined"){
            func = page;
            page = undefined;
        }
        fetchData('task','get_list',{values:{type:type,page:page}},function(ret,err){
            func(ret,err);
        })
      }

      tl.task.get_list_status=function(status,page,func){
          if(typeof func == "undefined"){
              func = page;
              page = undefined;
          }
          var user_id=$api.getStorage("trealent_user_id");
          if(status==1){
          fetchData('task','get_published_list',{values:{demander_id:user_id,page:page}},function(ret,err){
            func(ret,err);
          });
        }
        else{
          var method=["get_tender_list","get_task_going_list","get_task_waiting_list","get_task_finished_list"];
          fetchData('task',method[status-2],{values:{user_id:user_id,page:page}},function(ret,err){
            func(ret,err);
        })
      }
    }


    tl.task.getWatingGroupList=function(task_id,page,func){
      if(typeof func == "undefined"){
          func = page;
          page = undefined;
      }
      fetchData('task','get_tender_waiting_list',{values:{task_id:task_id,page:page}},function(ret,err){
        func(ret,err);
      })
    }


    tl.task.getGoingTaskList=function(user_id,page,func){
      if(typeof func == "undefined"){
          func = page;
          page = undefined;
      }
      fetchData('task','get_task_going_list',{values:{user_id:user_id,page:page}},function(ret,err){
        func(ret,err);
      })
    }


    tl.task.getTaskDetailInfo=function(task_id,func){
      fetchData('task','task_detail_info',{values:{task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }




    tl.user.TaskTender=function(user_id,task_id,func){
      fetchData('user','do_tender',{values:{uid:user_id,task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }

    tl.user.TaskTenderStatus=function(user_id,task_id,func){
      fetchData('user','tender_status',{values:{uid:user_id,task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }

    tl.user.TaskTenderCancel=function(user_id,task_id,func){
      fetchData('user','undo_tender',{values:{uid:user_id,task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }

    tl.user.TaskConfirm=function(apply_id,func){
      fetchData('user','do_confirm',{values:{id:apply_id}},function(ret,err){
        if(ret){
          func(ret,err);
        }
        else{
          api.toast({
              msg: '网络错误',
              duration: 2000,
              location: 'bottom'
          });

        }
      })
    }

    tl.user.StartTask=function(task_id,func){
      fetchData('user','start_task',{values:{task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }


    tl.user.SubmitTask=function(user_id,task_id,func){
      fetchData('user','submit_task',{values:{user_id:user_id,task_id:task_id}},function(ret,err){
        func(ret,err);
      })
    }

  window.tlClient = tl;
})(window);
