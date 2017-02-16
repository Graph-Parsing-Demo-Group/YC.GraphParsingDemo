namespace YC.GraphParsingDemo

open WebSharper.Formlets

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client


module wsfc = WebSharper.Formlets.Controls
module wsfe = WebSharper.Formlets.Enhance
module wsfd = WebSharper.Formlets.Data
module wsff = WebSharper.Formlets.Formlet
module wsfl = WebSharper.Formlets.Layout


[<JavaScript>]
module Client =
    
    let mutable globalTree : Yard.Generators.Common.ASTGLL.Tree<Parser.Token> = null
    let mutable globalGraph : Parser.InputGraph = 
        {
            countOfVertex = 0
            edges = [||]
        }

    let screenWidth = JQuery.JQuery.Of("html").Width()
    let screenHeight = JQuery.JQuery.Of("html").Height()

    let getFormSize (height: int) (width: int) = 
        ((height * screenHeight / 638).ToString() + "px", (width * screenWidth / 1366).ToString() + "px")

    let setFormSize ((height: string), (width: string)) (formletType: string) (formlet: Formlets.Data.Formlet<'c>) =
        formlet |> wsff.MapElement (fun e ->
            JQuery.JQuery.Of(e.Dom.QuerySelector(formletType))
                .Css("height", height) 
                .Css("width", width)
                .Ignore
            e)
    let style = "padding-top: 0px; background-color: #FF69B4; border-width: 0px; border-color: #000000; border-radius: 10px; color: #000000; height: " + fst(getFormSize 40 150) + "; width: " + snd(getFormSize 40 150) + "; font-size:" + fst(getFormSize 15 15);                                                                                              
 
    let FileControl = 
        let readFile (elFrom: Element) (stateChanged: Event<_>) =
            let file = (WebSharper.JavaScript.FileList.OfElement elFrom.Dom).Item 0
            let reader = new WebSharper.JavaScript.TextFileReader()            
            reader.ReadAsText file
            reader.AddEventListener("load", (fun () -> stateChanged.Trigger(Result.Success reader.Result)), true)

        Formlet.BuildFormlet <| fun() ->
            let stateChanged = new Event<Result<string>>()
            let input =
                Input [Attr.Type "file"; Attr.Accept "text/*"]
                |>! OnChange (fun e -> readFile e stateChanged)                        
            let reset () =
                input.Value <- ""
                stateChanged.Trigger(Result.Success "")
            input, reset, stateChanged.Publish
        |> Formlet.InitWith ""
    
    let RangeControl =
        wsff.Yield (fun min max -> (int min, int max))
        <*> wsff.Do {
                let! initVert = 
                    wsfc.Input ""
                    |> wsfe.WithTextLabel "Initial" 
                    |> setFormSize (getFormSize 20 50) "input"
                return initVert }
        <*> wsff.Do {                
                let! finVert = 
                    wsfc.Input ""
                    |> wsfe.WithTextLabel "Final" 
                    |> setFormSize (getFormSize 20 50) "input"      
                return finVert }
        |> wsff.Horizontal 
        |> wsfe.WithTextLabel "Vertices"
        |> wsfe.WithLabelAbove
        |> wsfe.WithFormContainer
    
    let ErrorControl errortxt lbl = 
        wsff.Do {
        let! output =
            wsff.OfElement (fun () -> TextArea [Attr.ReadOnly "readonly"; Text errortxt] )
            |> wsfe.WithTextLabel lbl
            |> wsfe.WithLabelAbove
            |> setFormSize (getFormSize 90 540) "textarea" 
        return output  }
        |> wsfe.WithFormContainer

    let ShowGraphImageControl lbl (graph : Parser.InputGraph)  = 
       wsff.OfElement (fun () ->
            let hw = "height: " + fst(getFormSize 90 540) + "; width: " + snd(getFormSize 120 540)
            do()
            Img[Attr.Style hw; Attr.Src "yeahboy.pnfg"]
        )
       |> wsfe.WithTextLabel lbl 
       |> wsfe.WithLabelAbove 
       |> wsfe.WithFormContainer  

    let ShowTreeImageControl lbl (tree : Parser.ParsedSppf)  = 
       wsff.OfElement (fun () ->
            let hw = "height: " + fst(getFormSize 90 540) + "; width: " + snd(getFormSize 120 540)
            do()
            Img[Attr.Style hw; Attr.Src "yeahboy.png"]
        )
       |> wsfe.WithTextLabel lbl 
       |> wsfe.WithLabelAbove 
       |> wsfe.WithFormContainer  

    let ShowSPPFImageControl lbl (tree : Yard.Generators.Common.ASTGLL.Tree<Parser.Token>) = 
       wsff.OfElement (fun () ->
            let hw = "height: " + fst(getFormSize 90 540) + "; width: " + snd(getFormSize 120 540)
            let tre = Server.sppfToParsed tree
            do()
            Img[Attr.Style hw; Attr.Src "yeahboy.png"]
        )
       |> wsfe.WithTextLabel lbl 
       |> wsfe.WithLabelAbove 
       |> wsfe.WithFormContainer
                        
    let InputControl lbl defaultValue = 
       wsff.Do {
            let! (fileInput) = wsff.Do {  
                let! fileInput = FileControl
                return  (fileInput) } |> wsfe.WithFormContainer 
                                      
            let txt = 
                match fileInput with
                | "" -> defaultValue
                | _ -> fileInput
            let! textInput =
                wsfc.TextArea txt            
                |> wsfe.WithTextLabel lbl
                |> wsfe.WithLabelAbove
                |> setFormSize (getFormSize 90 540) "textarea"          
            return (textInput) }
         |> wsff.FlipBody
         |> wsff.Vertical
         |> wsfe.WithFormContainer

    let MegaGigaForm = 
        let MegaInputForm = 
            let GraphInputForm  = 
                wsff.Do {
                    let! graph = InputControl "Graph" ( Server.LoadDefaultFile Server.FileType.Graph)
                    let! checkbox1 = wsfc.Checkbox false |> wsfe.WithTextLabel "Show formal subgraph" |> wsfe.WithLabelLeft |> wsfe.WithFormContainer 
                    return(graph, checkbox1)
                    }        
                |> wsff.Vertical  
            let GrammarInputForm =          
                    wsff.Do {
                        let! grammar = InputControl "Grammar"( Server.LoadDefaultFile Server.FileType.Grammar)
                        let! checkbox2 = wsfc.Checkbox false |> wsfe.WithTextLabel "Remove redundant nodes" |> wsfe.WithLabelLeft|> wsfe.WithFormContainer 
                        return (grammar, checkbox2)
                    }
                    |> wsff.Vertical
            (wsff.Yield (fun (grm: string*bool) (graph: string*bool)  -> (grm, graph))
            <*> (GrammarInputForm)
            <*> (GraphInputForm))
            |> wsff.Horizontal
            |> wsfe.WithCustomSubmitButton ({ wsfe.FormButtonConfiguration.Default with 
                                                                                            Label = Some "SHOW GRAPH" 
                                                                                            Style = Some style                                                                                
                                                                                            })
            |> wsff.Vertical
                
        let ExtraOutputForm (((grammar: string),( ch1: bool)), ((graph: string), (ch2: bool))) =   //общая форма для всего, что ниже кнопки "show graph"
            let BothVisualizationForms = 
                let MegaOutputForm  =                               // объединяет визуализацию и rangecontrol
                    let VisualizationForm  =                        // здесь выводятся оба графа
                        wsff.Do {
                            match Server.Draw grammar graph ch1 ch2 with
                            | Server.Result.Error msg ->
                                let! picture1 = ErrorControl msg "Graph Visualization"
                                let! picture2 = ErrorControl msg "SPPF"
                                return (picture1, picture2)
                            | Server.Result.SucSppfGraph (tree, graph) ->
                                let! picture1 = ShowGraphImageControl "Graph Visualization" graph
                                let! picture2 = ShowSPPFImageControl "SPPF" tree
                                globalTree <- tree
                                globalGraph  <- graph
                                return (picture1, picture2)
                        
                        } |> wsff.Horizontal |> wsfe.WithFormContainer 
                    wsff.Do {
                        let! x = VisualizationForm 
                        return x }

                let RangeAndButtonForm  =
                        wsff.Do {
                        let! rng = RangeControl

                        return rng  }                   
                        |> wsfe.WithCustomSubmitButton ({ wsfe.FormButtonConfiguration.Default with 
                                                                                                    Label = Some "FIND PATH"
                                                                                                    Style = Some style 
                                                                                                    })   
                        |> wsff.Horizontal    
                wsff.Do {
                        let! x = MegaOutputForm 
                        let! y =  RangeAndButtonForm
                        return (x, y) }
                        |> wsff.Vertical
            let VisualizationForm2 rng  = // визуализация кратчайшего пути (появляется после кнопки "find path")
                        wsff.Do {
                        if fst rng < snd rng
                        then
                            if globalTree <> null
                            then
                                match Server.findMinLen globalTree globalGraph (fst rng) (snd rng) with
                                | Server.Result.Error msg ->
                                    let! picture1 = ErrorControl msg "Path"
                                    let! picture2 = ErrorControl msg "SPPF Path" 
                                    return (picture1, picture2)
                                | Server.Result.SucTreeGraph (tree, graph) ->
                                    let! picture1 = ShowGraphImageControl "Path" graph
                                    let! picture2 = ShowTreeImageControl "SPPF Path" tree
                                    return (picture1, picture2)
                            else
                                let! picture1 = ErrorControl "empty" "Path"
                                let! picture2 = ErrorControl "empty" "SPPF Path"
                                return (picture1, picture2)
                        else
                            let! picture1 = ErrorControl "incorrect range" "Path"
                            let! picture2 = ErrorControl "incorrect range" "SPPF Path"
                            return (picture1, picture2)
                        
                                 } |> wsff.Horizontal |> wsfe.WithFormContainer
            wsff.Do {
                let! x = BothVisualizationForms 
                let! y =  VisualizationForm2 (snd x)
                return (x, y) }
                |> wsff.Vertical  
                     
        wsff.Do {
                let! x = MegaInputForm 
                let! y =  ExtraOutputForm x
                return (x, y) }
                |> wsff.Vertical
    
    let Main () =
        let MainForm =
            MegaGigaForm.Run(fun _ -> ())
        
        Div [      
           MainForm
        ] 

