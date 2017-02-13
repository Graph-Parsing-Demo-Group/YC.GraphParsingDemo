namespace YC.GraphParsingDemo

open WebSharper
open Yard.Frontends.YardFrontend.Main
open Yard.Generators.GLL.AbstractParser
open AbstractAnalysis.Common
open Yard.Generators.GLL
open Yard.Generators.Common.FinalGrammar
open Yard.Generators.Common.InitialConvert
open Yard.Generators.Common.ASTGLL
open Yard.Generators.GLL.ParserCommon
open System.Collections.Generic
open Yard.Generators.GLL
open Yard.Generators.Common

module Server = 

    type Result =
        | SucSppf of Tree<Parser.Token>
        | SucSppfGraph of Tree<Parser.Token> * Parser.InputGraph
        | SucGraph of Parser.InputGraph
        | Error of string

    type FileType =
        | Graph
        | Grammar

    [<Rpc>]
    let LoadDefaultFileNames (fileType: FileType) =
        match fileType with
        | Grammar ->
            [
                "Grammar1"
                "Grammar2"
                "Grammar3"
            ]
        | Graph ->
            [
                "Graph1"
                "Graph2"
                "Graph3"
            ]

    [<Rpc>]
    let LoadDefaultFile (fileType: FileType) name =
        match fileType with
        | Grammar ->
            match name with
            | "Grammar1" -> @"Gram1"
            | "Grammar2" -> @"Gram2"
            | "Grammar3" -> @"Gram3"
            |  _  -> ""
        | Graph ->
            match name with
            | "Graph1" -> @"Graph1"
            | "Graph2" -> @"Graph2"
            | "Graph3" -> @"Graph3"
            |  _  -> ""

    [<Rpc>]
    let Draw (grammar'text : string) (graph'text : string) (isMinimised : bool) =
        try
            if grammar'text = "" && graph'text = "" then Error "Empty input"
            elif graph'text = "" then Error "Empty graph input"
            elif grammar'text = "" then Error "Empty grammar input"
            else
                let grammar, graph = Parser.grmParse grammar'text, Parser.graphParse graph'text
                match Parser.parse grammar graph with
                | Yard.Generators.GLL.ParserCommon.ParseResult.Error msg -> Error msg
                | Yard.Generators.GLL.ParserCommon.ParseResult.Success tree ->
                    if isMinimised
                    then
                        SucSppf tree
                    else
                        SucSppf tree
        with
        | e -> Error e.Message

    [<Rpc>]
    let getFormalSubgraph (tree : Tree<Parser.Token>) =
        try
            let formalSubgraph = Parser.getFormalSubgraph tree
            if formalSubgraph.countOfVertex <> 0
            then
                SucGraph(formalSubgraph)
            else
                Error "There is no verticles in subgraph"
        with
        |e -> Error e.Message