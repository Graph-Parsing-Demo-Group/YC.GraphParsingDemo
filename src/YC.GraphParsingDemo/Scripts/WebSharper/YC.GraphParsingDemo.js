(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Control,FSharpEvent,List,Html,Client,Attr,Tags,FileReader,IntelliFactory,Formlets,Base,Result,EventsPervasives,Formlets1,Formlet,YC,GraphParsingDemo,Client1,Enhance,Controls,Data,FormButtonConfiguration,Remoting,AjaxRemotingProvider,Operators,MatchFailureException,String,jQuery;
 Runtime.Define(Global,{
  YC:{
   GraphParsingDemo:{
    Client:{
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
      var _builder_,formlet,GraphInputForm,_builder_1,formlet4,GrammarInputForm,formlet5,x,inputRecord,buttonConf,x1,MegaInputForm,ExtraOutputForm,_builder_6,formlet6;
      _builder_=Formlet.Do();
      formlet=_builder_.Delay(function()
      {
       return _builder_.Bind(Client1.InputControl("Graph",""),function(_arg1)
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
       return _builder_1.Bind(Client1.InputControl("Grammar",""),function(_arg3)
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
        $0:"Show me love"
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
       var _arg5,_arg6,graph,ch1,grammar,ch2,_builder_2,formlet1,formlet2,VisualizationForm,_builder_3,MegaOutputForm,_builder_4,x2,inputRecord1,buttonConf1,x3,RangeAndButtonForm,_builder_5,formlet3;
       _arg5=tupledArg[0];
       _arg6=tupledArg[1];
       graph=_arg5[0];
       ch1=_arg5[1];
       grammar=_arg6[0];
       ch2=_arg6[1];
       _builder_2=Formlet.Do();
       formlet1=_builder_2.Delay(function()
       {
        var matchValue,_,msg,tree,graph1;
        matchValue=AjaxRemotingProvider.Sync("YC.GraphParsingDemo:1",[grammar,graph,ch1,ch2]);
        if(matchValue.$==4)
         {
          msg=matchValue.$0;
          _=_builder_2.Bind(Client1.ShowGraphImageControl("Graph Visualization",{
           $:0
          },msg),function(_arg7)
          {
           return _builder_2.Bind(Client1.ShowSPPFImageControl("SPPF",{
            $:0
           },msg),function(_arg8)
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
            _=_builder_2.Bind(Client1.ShowGraphImageControl("Graph Visualization",{
             $:1,
             $0:graph1
            },""),function(_arg9)
            {
             return _builder_2.Bind(Client1.ShowSPPFImageControl("SPPF",{
              $:1,
              $0:tree
             },""),function(_arg10)
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
            _=Operators.Raise(MatchFailureException.New("C:\\MyProjects\\github\\gpdg\\src\\YC.GraphParsingDemo\\Client.fs",154,30));
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
         $0:"\u0418\u0437\u0432\u043b\u0435\u0447\u044c \u0447\u043e\u0442\u043e"
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
       return Formlet.Vertical(formlet3);
      };
      _builder_6=Formlet.Do();
      formlet6=_builder_6.Delay(function()
      {
       return _builder_6.Bind(MegaInputForm,function(_arg15)
       {
        return _builder_6.Bind(ExtraOutputForm(_arg15),function(_arg16)
        {
         return _builder_6.Return([_arg15,_arg16]);
        });
       });
      });
      return Formlet.Vertical(formlet6);
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
     ShowGraphImageControl:function(lbl,graph)
     {
      var formlet,formlet1,formlet2;
      formlet=Formlet.OfElement(function()
      {
       var hw,_,arg10,arg101;
       hw="height: "+(Client1.getFormSize(90,540))[0]+"; width: "+(Client1.getFormSize(120,540))[1];
       if(graph.$==1)
        {
         graph.$0;
         arg10=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
         _=Tags.Tags().NewTag("img",arg10);
        }
       else
        {
         arg101=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
         _=Tags.Tags().NewTag("img",arg101);
        }
       return _;
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
       var hw,_,tr,arg10,arg101;
       hw="height: "+(Client1.getFormSize(90,540))[0]+"; width: "+(Client1.getFormSize(120,540))[1];
       if(tree.$==1)
        {
         tr=tree.$0;
         AjaxRemotingProvider.Sync("YC.GraphParsingDemo:3",[tr]);
         arg10=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
         _=Tags.Tags().NewTag("img",arg10);
        }
       else
        {
         arg101=List.ofArray([Attr.Attr().NewAttr("style",hw),Attr.Attr().NewAttr("src","yeahboy.png")]);
         _=Tags.Tags().NewTag("img",arg101);
        }
       return _;
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
      return null;
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
  Control=Runtime.Safe(Global.WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Attr=Runtime.Safe(Client.Attr);
  Tags=Runtime.Safe(Client.Tags);
  FileReader=Runtime.Safe(Global.FileReader);
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Formlets=Runtime.Safe(IntelliFactory.Formlets);
  Base=Runtime.Safe(Formlets.Base);
  Result=Runtime.Safe(Base.Result);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  Formlets1=Runtime.Safe(Global.WebSharper.Formlets);
  Formlet=Runtime.Safe(Formlets1.Formlet);
  YC=Runtime.Safe(Global.YC);
  GraphParsingDemo=Runtime.Safe(YC.GraphParsingDemo);
  Client1=Runtime.Safe(GraphParsingDemo.Client);
  Enhance=Runtime.Safe(Formlets1.Enhance);
  Controls=Runtime.Safe(Formlets1.Controls);
  Data=Runtime.Safe(Formlets1.Data);
  FormButtonConfiguration=Runtime.Safe(Enhance.FormButtonConfiguration);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
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
