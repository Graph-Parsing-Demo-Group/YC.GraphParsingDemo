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
    
    let mutable globalTree : obj = null
    let mutable globalGraph : obj = null

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

    let ShowGraphImageControl lbl ((graph : Option<Parser.InputGraph>), str : string)  = 
       wsff.OfElement (fun () ->
            let hw = "height: " + fst(getFormSize 90 540) + "; width: " + snd(getFormSize 120 540)
            match graph with
            | None ->
                Img[Attr.Style hw; Attr.Src "yeahboy.png"]
            | Some grph ->
                do()
                Img[Attr.Style hw; Attr.Src "yeahboy.png"]
        )
       |> wsfe.WithTextLabel lbl 
       |> wsfe.WithLabelAbove 
       |> wsfe.WithFormContainer  

    let ShowSPPFImageControl lbl ((tree : Option<Yard.Generators.Common.ASTGLL.Tree<Parser.Token>>), str : string) = 
       wsff.OfElement (fun () ->
            let hw = "height: " + fst(getFormSize 90 540) + "; width: " + snd(getFormSize 120 540)
            match tree with
            | None ->
                Img[Attr.Style hw; Attr.Src "yeahboy.png"]
            | Some tr ->
                let tre = Server.sppfToParsed tr
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
                    let! graph = InputControl "Graph" ""
                    let! checkbox1 = wsfc.Checkbox false |> wsfe.WithTextLabel "Show formal subgraph" |> wsfe.WithLabelLeft |> wsfe.WithFormContainer 
                    return(graph, checkbox1)
                    }        
                |> wsff.Vertical  
            let GrammarInputForm =          
                    wsff.Do {
                        let! grammar = InputControl "Grammar" ""
                        let! checkbox2 = wsfc.Checkbox false |> wsfe.WithTextLabel "Remove redundant nodes" |> wsfe.WithLabelLeft|> wsfe.WithFormContainer 
                        return (grammar, checkbox2)
                    }
                    |> wsff.Vertical
            (wsff.Yield (fun (grm: string*bool) (graph: string*bool)  -> (grm, graph))
            <*> (GrammarInputForm)
            <*> (GraphInputForm))
            |> wsff.Horizontal
            |> wsfe.WithCustomSubmitButton ({ wsfe.FormButtonConfiguration.Default with 
                                                                                            Label = Some "Show me love" 
                                                                                            Style = Some style                                                                                
                                                                                            })
            |> wsff.Vertical
                
        let ExtraOutputForm (((graph: string),( ch1: bool)), ((grammar: string), (ch2: bool))) =   
            let MegaOutputForm  = 
                let VisualizationForm  = 
                    wsff.Do {
                        match Server.Draw grammar graph ch1 ch2 with
                        | Server.Result.Error msg ->
                            let! picture1 = ShowGraphImageControl "Graph Visualization" (None, msg)
                            let! picture2 = ShowSPPFImageControl "SPPF" (None, msg)
                            return (picture1, picture2)
                        | Server.Result.SucSppfGraph (tree, graph) ->
                            let! picture1 = ShowGraphImageControl "Graph Visualization" ((Some graph), "")
                            let! picture2 = ShowSPPFImageControl "SPPF" ((Some tree), "")
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
                                                                                                Label = Some "Извлечь чото"
                                                                                                Style = Some style 
                                                                                                })   
                    |> wsff.Horizontal    
            wsff.Do {
                    let! x = MegaOutputForm 
                    let! y =  RangeAndButtonForm
                    return (x, y) }
                    |> wsff.Vertical
            let VisualizationForm2  = 
                        wsff.Do {
                        if fst rng < snd rng
                        then
                            if globalTree <> null && globalGraph <> null
                            then
                                match Server.findMinLen globalTree (Parser.toInputGraph globalGraph) (fst rng) (snd rng) with
                                | Server.Result.Error msg ->
                                    let! picture1 = ShowGraphImageControl "Graph Visualization" (None, msg)
                                    let! picture2 = ShowSPPFImageControl "SPPF" (None, msg)
                                | Server.Result.SucSppfGraph (tree, graph) ->
                                    let! picture1 = ShowGraphImageControl "Graph Visualization" ((Some graph), "")
                                    let! picture2 = ShowSPPFImageControl "SPPF" ((Some tree), "")
                            else
                                let! picture1 = ShowGraphImageControl "Graph Visualization" (None, "No Sppf")
                                let! picture2 = ShowSPPFImageControl "SPPF" (None, "No Sppf")
                        else
                            let! picture1 = ShowGraphImageControl "Graph Visualization" (None, "incorrect range")
                            let! picture2 = ShowSPPFImageControl "SPPF" (None, "incorrect range")
                        let!  Show
                                return (picture1, picture2)
                        
                    } |> wsff.Horizontal |> wsfe.WithFormContainer        
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

