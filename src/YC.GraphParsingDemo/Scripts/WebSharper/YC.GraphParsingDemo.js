(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Formlets,Formlet,List,Html,Client,Attr,Tags,Enhance,YC,GraphParsingDemo,Client1,Control,FSharpEvent,FileReader,IntelliFactory,Formlets1,Base,Result,EventsPervasives,Controls,Remoting,AjaxRemotingProvider,Data,FormButtonConfiguration,Operators,MatchFailureException,Unchecked,String,jQuery;
 Runtime.Define(Global,{
  YC:{
   GraphParsingDemo:{
    Client:{
     ErrorControl:function(errortxt,lbl)
     {
      var _builder_,formlet;
      _builder_=Formlet.Do();
      formlet=_builder_.Delay(function()
      {
       var formlet1,formlet2,x,tupledArg,height,width;
       formlet1=Formlet.OfElement(function()
       {
        var arg10;
        arg10=List.ofArray([Attr.Attr().NewAttr("readonly","readonly"),Tags.Tags().text(errortxt)]);
        return Tags.Tags().NewTag("textarea",arg10);
       });
       formlet2=Enhance.WithTextLabel(lbl,formlet1);
       x=Enhance.WithLabelAbove(formlet2);
       tupledArg=Client1.getFormSize(90,540);
       height=tupledArg[0];
       width=tupledArg[1];
       return _builder_.Bind(Client1.setFormSize(height,width,"textarea",x),function(_arg1)
       {
        return _builder_.Return(_arg1);
       });
      });
      return Enhance.WithFormContainer(formlet);
     },
     FileControl:Runtime.Field(function()
     {
      var f,formlet;
      f=function()
      {
       var stateChanged,x,x1,arg00,input,reset;
       stateChanged=FSharpEvent.New();
       x=List.ofArray([Attr.Attr().NewAttr("type","file"),Attr.Attr().NewAttr("accept","text/*")]);
       x1=Tags.Tags().NewTag("input",x);
       arg00=function(el)
       {
        return function()
        {
         var file,reader;
         file=el.Dom.files.item(0);
         reader=new FileReader();
         reader.readAsText(file);
         return reader.addEventListener("load",function()
         {
          return stateChanged.event.Trigger(Runtime.New(Result,{
           $:0,
           $0:reader.result
          }));
         },true);
        };
       };
       EventsPervasives.Events().OnChange(arg00,x1);
       input=x1;
       reset=function()
       {
        input.set_Value("");
        return stateChanged.event.Trigger(Runtime.New(Result,{
         $:0,
         $0:""
        }));
       };
       return[input,reset,stateChanged.event];
      };
      formlet=Formlet.BuildFormlet(f);
      return Formlet.InitWith("",formlet);
     }),
     InputControl:function(lbl,defaultValue)
     {
      var _builder_,formlet,formlet4,formlet5;
      _builder_=Formlet.Do();
      formlet=_builder_.Delay(function()
      {
       var _builder_1,formlet1;
       _builder_1=Formlet.Do();
       formlet1=_builder_1.Delay(function()
       {
        return _builder_1.Bind(Client1.FileControl(),function(_arg1)
        {
         return _builder_1.Return(_arg1);
        });
       });
       return _builder_.Bind(Enhance.WithFormContainer(formlet1),function(_arg2)
       {
        var txt,formlet2,formlet3,x,tupledArg,height,width;
        txt=_arg2===""?defaultValue:_arg2;
        formlet2=Controls.TextArea(txt);
        formlet3=Enhance.WithTextLabel(lbl,formlet2);
        x=Enhance.WithLabelAbove(formlet3);
        tupledArg=Client1.getFormSize(90,540);
        height=tupledArg[0];
        width=tupledArg[1];
        return _builder_.Bind(Client1.setFormSize(height,width,"textarea",x),function(_arg3)
        {
         return _builder_.Return(_arg3);
        });
       });
      });
      formlet4=Formlet.FlipBody(formlet);
      formlet5=Formlet.Vertical(formlet4);
      return Enhance.WithFormContainer(formlet5);
     },
     Main:function()
     {
      var arg10;
      arg10=List.ofArray([Client1.MegaGigaForm().Run(function()
      {
       return null;
      })]);
      return Tags.Tags().NewTag("div",arg10);
     },
     MegaGigaForm:Runtime.Field(function()
     {
      var _builder_,formlet,GraphInputForm,_builder_1,formlet4,GrammarInputForm,formlet5,x,inputRecord,buttonConf,x1,MegaInputForm,ExtraOutputForm,_builder_8,formlet9;
      _builder_=Formlet.Do();
      formlet=_builder_.Delay(function()
      {
       return _builder_.Bind(Client1.InputControl("Graph",AjaxRemotingProvider.Sync("YC.GraphParsingDemo:0",[{
        $:0
       }])),function(_arg1)
       {
        var formlet1,formlet2,formlet3;
        formlet1=Controls.Checkbox(false);
        formlet2=Enhance.WithTextLabel("Show formal subgraph",formlet1);
        formlet3=Enhance.WithLabelLeft(formlet2);
        return _builder_.Bind(Enhance.WithFormContainer(formlet3),function(_arg2)
        {
         return _builder_.Return([_arg1,_arg2]);
        });
       });
      });
      GraphInputForm=Formlet.Vertical(formlet);
      _builder_1=Formlet.Do();
      formlet4=_builder_1.Delay(function()
      {
       return _builder_1.Bind(Client1.InputControl("Grammar",AjaxRemotingProvider.Sync("YC.GraphParsingDemo:0",[{
        $:1
       }])),function(_arg3)
       {
        var formlet1,formlet2,formlet3;
        formlet1=Controls.Checkbox(false);
        formlet2=Enhance.WithTextLabel("Remove redundant nodes",formlet1);
        formlet3=Enhance.WithLabelLeft(formlet2);
        return _builder_1.Bind(Enhance.WithFormContainer(formlet3),function(_arg4)
        {
         return _builder_1.Return([_arg3,_arg4]);
        });
       });
      });
      GrammarInputForm=Formlet.Vertical(formlet4);
      formlet5=Data.$(Data.$(Formlet.Return(function(grm)
      {
       return function(graph)
       {
        return[grm,graph];
       };
      }),GrammarInputForm),GraphInputForm);
      x=Formlet.Horizontal(formlet5);
      inputRecord=FormButtonConfiguration.get_Default();
      buttonConf=Runtime.New(FormButtonConfiguration,{
       Label:{
        $:1,
        $0:"SHOW GRAPH"
       },
       Style:{
        $:1,
        $0:Client1.style()
       },
       Class:inputRecord.Class
      });
      x1=Enhance.WithCustomSubmitButton(buttonConf,x);
      MegaInputForm=Formlet.Vertical(x1);
      ExtraOutputForm=function(tupledArg)
      {
       var _arg5,_arg6,grammar,ch1,graph,ch2,_builder_2,formlet1,formlet2,VisualizationForm,_builder_3,MegaOutputForm,_builder_4,x2,inputRecord1,buttonConf1,x3,RangeAndButtonForm,_builder_5,formlet3,BothVisualizationForms,VisualizationForm2,_builder_7,formlet8;
       _arg5=tupledArg[0];
       _arg6=tupledArg[1];
       grammar=_arg5[0];
       ch1=_arg5[1];
       graph=_arg6[0];
       ch2=_arg6[1];
       _builder_2=Formlet.Do();
       formlet1=_builder_2.Delay(function()
       {
        var matchValue,_,msg,tree,graph1;
        matchValue=AjaxRemotingProvider.Sync("YC.GraphParsingDemo:1",[grammar,graph,ch1,ch2]);
        if(matchValue.$==4)
         {
          msg=matchValue.$0;
          _=_builder_2.Bind(Client1.ErrorControl(msg,"Graph Visualization"),function(_arg7)
          {
           return _builder_2.Bind(Client1.ErrorControl(msg,"SPPF"),function(_arg8)
           {
            return _builder_2.Return([_arg7,_arg8]);
           });
          });
         }
        else
         {
          if(matchValue.$==1)
           {
            tree=matchValue.$0;
            graph1=matchValue.$1;
            _=_builder_2.Bind(Client1.ShowGraphImageControl("Graph Visualization",graph1),function(_arg9)
            {
             return _builder_2.Bind(Client1.ShowSPPFImageControl("SPPF",tree),function(_arg10)
             {
              Client1.globalTree=function()
              {
               return tree;
              };
              Client1.globalGraph=function()
              {
               return graph1;
              };
              return _builder_2.Return([_arg9,_arg10]);
             });
            });
           }
          else
           {
            _=Operators.Raise(MatchFailureException.New("C:\\YC.GraphParsingDemo\\src\\YC.GraphParsingDemo\\Client.fs",171,34));
           }
         }
        return _;
       });
       formlet2=Formlet.Horizontal(formlet1);
       VisualizationForm=Enhance.WithFormContainer(formlet2);
       _builder_3=Formlet.Do();
       MegaOutputForm=_builder_3.Delay(function()
       {
        return _builder_3.Bind(VisualizationForm,function(_arg11)
        {
         return _builder_3.Return(_arg11);
        });
       });
       _builder_4=Formlet.Do();
       x2=_builder_4.Delay(function()
       {
        return _builder_4.Bind(Client1.RangeControl(),function(_arg12)
        {
         return _builder_4.Return(_arg12);
        });
       });
       inputRecord1=FormButtonConfiguration.get_Default();
       buttonConf1=Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"FIND PATH"
        },
        Style:{
         $:1,
         $0:Client1.style()
        },
        Class:inputRecord1.Class
       });
       x3=Enhance.WithCustomSubmitButton(buttonConf1,x2);
       RangeAndButtonForm=Formlet.Horizontal(x3);
       _builder_5=Formlet.Do();
       formlet3=_builder_5.Delay(function()
       {
        return _builder_5.Bind(MegaOutputForm,function(_arg13)
        {
         return _builder_5.Bind(RangeAndButtonForm,function(_arg14)
         {
          return _builder_5.Return([_arg13,_arg14]);
         });
        });
       });
       BothVisualizationForms=Formlet.Vertical(formlet3);
       VisualizationForm2=function(rng)
       {
        var _builder_6,formlet6,formlet7;
        _builder_6=Formlet.Do();
        formlet6=_builder_6.Delay(function()
        {
         var _,_1,matchValue,_2,msg,tree,graph1;
         if(rng[0]<rng[1])
          {
           if(!Unchecked.Equals(Client1.globalTree(),null))
            {
             matchValue=AjaxRemotingProvider.Sync("YC.GraphParsingDemo:2",[Client1.globalTree(),Client1.globalGraph(),rng[0],rng[1]]);
             if(matchValue.$==4)
              {
               msg=matchValue.$0;
               _2=_builder_6.Bind(Client1.ErrorControl(msg,"Path"),function(_arg15)
               {
                return _builder_6.Bind(Client1.ErrorControl(msg,"SPPF Path"),function(_arg16)
                {
                 return _builder_6.Return([_arg15,_arg16]);
                });
               });
              }
             else
              {
               if(matchValue.$==2)
                {
                 tree=matchValue.$0;
                 graph1=matchValue.$1;
                 _2=_builder_6.Bind(Client1.ShowGraphImageControl("Path",graph1),function(_arg17)
                 {
                  return _builder_6.Bind(Client1.ShowTreeImageControl("SPPF Path",tree),function(_arg18)
                  {
                   return _builder_6.Return([_arg17,_arg18]);
                  });
                 });
                }
               else
                {
                 _2=Operators.Raise(MatchFailureException.New("C:\\YC.GraphParsingDemo\\src\\YC.GraphParsingDemo\\Client.fs",209,38));
                }
              }
             _1=_2;
            }
           else
            {
             _1=_builder_6.Bind(Client1.ErrorControl("empty","Path"),function(_arg19)
             {
              return _builder_6.Bind(Client1.ErrorControl("empty","SPPF Path"),function(_arg20)
              {
               return _builder_6.Return([_arg19,_arg20]);
              });
             });
            }
           _=_1;
          }
         else
          {
           _=_builder_6.Bind(Client1.ErrorControl("incorrect range","Path"),function(_arg21)
           {
            return _builder_6.Bind(Client1.ErrorControl("incorrect range","SPPF Path"),function(_arg22)
            {
             return _builder_6.Return([_arg21,_arg22]);
            });
           });
          }
         return _;
        });
        formlet7=Formlet.Horizontal(formlet6);
        return Enhance.WithFormContainer(formlet7);
       };
       _builder_7=Formlet.Do();
       formlet8=_builder_7.Delay(function()
       {
        return _builder_7.Bind(BothVisualizationForms,function(_arg23)
        {
         return _builder_7.Bind(VisualizationForm2(_arg23[1]),function(_arg24)
         {
          return _builder_7.Return([_arg23,_arg24]);
         });
        });
       });
       return Formlet.Vertical(formlet8);
      };
      _builder_8=Formlet.Do();
      formlet9=_builder_8.Delay(function()
      {
       return _builder_8.Bind(MegaInputForm,function(_arg25)
       {
        return _builder_8.Bind(ExtraOutputForm(_arg25),function(_arg26)
        {
         return _builder_8.Return([_arg25,_arg26]);
        });
       });
      });
      return Formlet.Vertical(formlet9);
     }),
     RangeControl:Runtime.Field(function()
     {
      var formlet,_builder_,_builder_1,formlet2,formlet3,formlet4;
      _builder_=Formlet.Do();
      _builder_1=Formlet.Do();
      formlet=Data.$(Data.$(Formlet.Return(function(min)
      {
       return function(max)
       {
        return[min<<0,max<<0];
       };
      }),_builder_.Delay(function()
      {
       var formlet1,x,tupledArg,height,width;
       formlet1=Controls.Input("");
       x=Enhance.WithTextLabel("Initial",formlet1);
       tupledArg=Client1.getFormSize(20,50);
       height=tupledArg[0];
       width=tupledArg[1];
       return _builder_.Bind(Client1.setFormSize(height,width,"input",x),function(_arg1)
       {
        return _builder_.Return(_arg1);
       });
      })),_builder_1.Delay(function()
      {
       var formlet1,x,tupledArg,height,width;
       formlet1=Controls.Input("");
       x=Enhance.WithTextLabel("Final",formlet1);
       tupledArg=Client1.getFormSize(20,50);
       height=tupledArg[0];
       width=tupledArg[1];
       return _builder_1.Bind(Client1.setFormSize(height,width,"input",x),function(_arg2)
       {
        return _builder_1.Return(_arg2);
       });
      }));
      formlet2=Formlet.Horizontal(formlet);
      formlet3=Enhance.WithTextLabel("Vertices",formlet2);
      formlet4=Enhance.WithLabelAbove(formlet3);
      return Enhance.WithFormContainer(formlet4);
     }),
     ShowGraphImageControl:function(lbl)
     {
      var formlet,formlet1,formlet2;
      formlet=Formlet.OfElement(function()
      {
       var hw,arg10;
       hw="height: "+(Client1.getFormSize(90,540))[0]+"; width: "+(Client1.getFormSize(120,540))[1];
       arg10=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.pnfg")]);
       return Tags.Tags().NewTag("img",arg10);
      });
      formlet1=Enhance.WithTextLabel(lbl,formlet);
      formlet2=Enhance.WithLabelAbove(formlet1);
      return Enhance.WithFormContainer(formlet2);
     },
     ShowSPPFImageControl:function(lbl,tree)
     {
      var formlet,formlet1,formlet2;
      formlet=Formlet.OfElement(function()
      {
       var hw,arg10;
       hw="height: "+(Client1.getFormSize(90,540))[0]+"; width: "+(Client1.getFormSize(120,540))[1];
       AjaxRemotingProvider.Sync("YC.GraphParsingDemo:3",[tree]);
       arg10=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
       return Tags.Tags().NewTag("img",arg10);
      });
      formlet1=Enhance.WithTextLabel(lbl,formlet);
      formlet2=Enhance.WithLabelAbove(formlet1);
      return Enhance.WithFormContainer(formlet2);
     },
     ShowTreeImageControl:function(lbl)
     {
      var formlet,formlet1,formlet2;
      formlet=Formlet.OfElement(function()
      {
       var hw,arg10;
       hw="height: "+(Client1.getFormSize(90,540))[0]+"; width: "+(Client1.getFormSize(120,540))[1];
       arg10=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
       return Tags.Tags().NewTag("img",arg10);
      });
      formlet1=Enhance.WithTextLabel(lbl,formlet);
      formlet2=Enhance.WithLabelAbove(formlet1);
      return Enhance.WithFormContainer(formlet2);
     },
     getFormSize:function(height,width)
     {
      var copyOfStruct,copyOfStruct1;
      copyOfStruct=height*Client1.screenHeight()/638>>0;
      copyOfStruct1=width*Client1.screenWidth()/1366>>0;
      return[String(copyOfStruct)+"px",String(copyOfStruct1)+"px"];
     },
     globalGraph:Runtime.Field(function()
     {
      return{
       countOfVertex:0,
       edges:[]
      };
     }),
     globalTree:Runtime.Field(function()
     {
      return null;
     }),
     screenHeight:Runtime.Field(function()
     {
      return jQuery("html").height();
     }),
     screenWidth:Runtime.Field(function()
     {
      return jQuery("html").width();
     }),
     setFormSize:function(height,width,formletType,formlet)
     {
      var f;
      f=function(e)
      {
       jQuery(e.Dom.querySelector(formletType)).css("height",height).css("width",width);
       return e;
      };
      return Formlet.MapElement(f,formlet);
     },
     style:Runtime.Field(function()
     {
      return"padding-top: 0px; background-color: #FF69B4; border-width: 0px; border-color: #000000; border-radius: 10px; color: #000000; height: "+(Client1.getFormSize(40,150))[0]+"; width: "+(Client1.getFormSize(40,150))[1]+"; font-size:"+(Client1.getFormSize(15,15))[0];
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Formlets=Runtime.Safe(Global.WebSharper.Formlets);
  Formlet=Runtime.Safe(Formlets.Formlet);
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Attr=Runtime.Safe(Client.Attr);
  Tags=Runtime.Safe(Client.Tags);
  Enhance=Runtime.Safe(Formlets.Enhance);
  YC=Runtime.Safe(Global.YC);
  GraphParsingDemo=Runtime.Safe(YC.GraphParsingDemo);
  Client1=Runtime.Safe(GraphParsingDemo.Client);
  Control=Runtime.Safe(Global.WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  FileReader=Runtime.Safe(Global.FileReader);
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Formlets1=Runtime.Safe(IntelliFactory.Formlets);
  Base=Runtime.Safe(Formlets1.Base);
  Result=Runtime.Safe(Base.Result);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  Controls=Runtime.Safe(Formlets.Controls);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  Data=Runtime.Safe(Formlets.Data);
  FormButtonConfiguration=Runtime.Safe(Enhance.FormButtonConfiguration);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  String=Runtime.Safe(Global.String);
  return jQuery=Runtime.Safe(Global.jQuery);
 });
 Runtime.OnLoad(function()
 {
  Client1.style();
  Client1.screenWidth();
  Client1.screenHeight();
  Client1.globalTree();
  Client1.globalGraph();
  Client1.RangeControl();
  Client1.MegaGigaForm();
  Client1.FileControl();
  return;
 });
}());
