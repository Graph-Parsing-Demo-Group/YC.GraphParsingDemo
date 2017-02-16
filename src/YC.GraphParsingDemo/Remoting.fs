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
        | SucTreeGraph of Parser.ParsedSppf * Parser.InputGraph
        | SucGraph of Parser.InputGraph
        | Error of string

    type FileType =
        | Graph
        | Grammar

    (*[<Rpc>]
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
            ]*)

    [<Rpc>]
    let LoadDefaultFile (fileType: FileType) =
        match fileType with
        | Grammar ->
            @"Gram1"
        | Graph ->
            @"Graph1"

    [<Rpc>]
    let Draw (grammar'text : string) (graph'text : string) (isMinimised : bool) (isFormal : bool)=
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
                        if isFormal
                        then
                            let minimisedTree = Parser.minimiseSppf tree
                            let formalSubgraph = Parser.getFormalSubgraph minimisedTree (Parser.graphToMap graph)
                            if formalSubgraph.countOfVertex <> 0
                            then
                                SucSppfGraph(minimisedTree, formalSubgraph)
                            else
                                Error "There is no verticles in subgraph"
                        else
                            let minimisedTree = Parser.minimiseSppf tree
                            SucSppfGraph (minimisedTree, Parser.toInputGraph graph)
                    else
                        if isFormal
                        then
                            let formalSubgraph = Parser.getFormalSubgraph tree (Parser.graphToMap graph)
                            if formalSubgraph.countOfVertex <> 0
                            then
                                SucSppfGraph(tree, formalSubgraph)
                            else
                                Error "There is no verticles in subgraph"
                        else
                            SucSppfGraph (tree, Parser.toInputGraph graph)
        with
        | e -> Error e.Message

    [<Rpc>]
    let findMinLen (tree : Tree<Parser.Token>) (graph : Parser.InputGraph) (first : int) (second : int) =
        try
            let nTNode = Parser.getNonTermNode tree (packExtension first second)
            match nTNode with
            | Parser.ResNode.Suc(node) ->
                let edges, nodes = Parser.getEdgesOfMinLen node
                let tree, graph = Parser.getTreeOfMnLn edges nodes node graph
                SucTreeGraph(tree, graph)
            |  Parser.ResNode.None -> 
                Error "No such nodes found"
            |  Parser.ResNode.Error msg -> 
                Error msg
        with
        |e -> Error e.Message

    [<Rpc>]
    let sppfToParsed (tree : Tree<Parser.Token>) =
        Parser.treeToParsed tree.Root (fun _ -> true)