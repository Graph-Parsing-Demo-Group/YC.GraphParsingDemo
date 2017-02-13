namespace YC.GraphParsingDemo

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client

[<JavaScript>]
module Client =
    let Main () =
        let input = Input [Attr.Value ""] -< []
        let output = H1 []
        Div [
            input
            Button [Text "Send"]
            |>! OnClick (fun _ _ ->
                async {
                    do()
                }
                |> Async.Start
            )
            HR []
            H4 [Attr.Class "text-muted"] -< [Text "The server responded:"]
            Div [Attr.Class "jumbotron"] -< [output]
        ]
