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

module Parser =
    type InputEdge = int * int * string * bool
    type InputGraph =
        {
            countOfVertex : int;
            edges : InputEdge[]
        }

    (*type ParsedSppf =
        {
            
        }*)

    type Token =
        | Term of string
        | EOF

    let graphParse graph_text =
        let gd = DotParser.parse graph_text
        let n = gd.Nodes.Count
        let g = new ParserInputGraph<Token>([|0..n|], [|n|])

        for i in 0..n do
            ignore <| g.AddVertex i

        for i in 0..n - 1 do
            ignore <| g.AddEdge(new ParserEdge<Token>(i, n, EOF))
    
        for edge in gd.Edges do
            let (x, y) = edge.Key
            let (a, b) = ref 0, ref 0
            if System.Int32.TryParse(x, a) && System.Int32.TryParse(y, b) then
                match edge.Value.Head.["label"] with
                | str -> ignore <| g.AddEdge(new ParserEdge<Token>(!a, !b, Term(str)))
        g
    
    let mutable indToString = fun i -> ""
    let mutable tokenToNumber = fun t -> 0
    let tokenData (t : Token) : obj = null

    let grmParse parser_text = 
        let text = parser_text
        let grm = ParseText text "file.yrd"
        let icg = initialConvert grm
        let fg = FinalGrammar(icg.grammar.[0].rules, true)

        tokenToNumber <- function
            | Term(str) -> fg.indexator.termToIndex str
            | EOF -> fg.indexator.eofIndex

        let genLiteral (s:string) (i:int): Token option = None
    
        let isLiteral (t : Token) : bool = false
        let isTerminal (t : Token) : bool = true
        let getLiteralNames = []

        let td = (Table fg).result
        let table = new System.Collections.Generic.Dictionary<int, int[]>()
        for k in td.Keys do
            table.Add(k, td.[k].ToArray())

        let rulesArr = Array.zeroCreate fg.rules.rulesCount
        for i = 0 to fg.rules.rulesCount-1 do
            rulesArr.[i] <- fg.rules.rightSide i

        let totalRulesLength = rulesArr |> Array.sumBy (fun x -> x.Length)
        let rules = Array.zeroCreate totalRulesLength
        let rulesStart = Array.zeroCreate <| fg.rules.rulesCount + 1
        let mutable cur = 0
        for i = 0 to fg.rules.rulesCount-1 do
            rulesStart.[i] <- cur
            for j = 0 to rulesArr.[i].Length-1 do
                rules.[cur] <- rulesArr.[i].[j]
                cur <- cur + 1
        rulesStart.[fg.rules.rulesCount] <- cur

        let acceptEmptyInput = true
        let numIsTerminal (i : int) : bool = fg.indexator.termsStart <= i && i <= fg.indexator.termsEnd
        let numIsNonTerminal (i : int): bool = fg.indexator.isNonTerm i
        let numIsLiteral (i : int) : bool = fg.indexator.literalsStart <= i && i <= fg.indexator.literalsEnd

        let numToString (n : int) : string =
            if numIsTerminal n then
                fg.indexator.indexToTerm n
            elif numIsNonTerminal n then
                fg.indexator.indexToNonTerm n
            elif numIsLiteral n then
                fg.indexator.indexToLiteral n
            else string n
    
        indToString <- numToString

        let inline packRulePosition rule position = (int rule <<< 16) ||| int position

        let slots = new List<_>()
        slots.Add(packRulePosition -1 -1, 0)
        for i = 0 to fg.rules.rulesCount - 1 do
            let currentRightSide = fg.rules.rightSide i
            for j = 0 to currentRightSide.Length - 1 do
                if fg.indexator.isNonTerm currentRightSide.[j] then
                    let key = packRulePosition i (j + 1)
                    slots.Add(key, slots.Count)

        let parserSource = new ParserSourceGLL<Token>(Token.EOF, tokenToNumber, genLiteral, numToString, tokenData, isLiteral, isTerminal, getLiteralNames, table, rules, rulesStart, fg.rules.leftSideArr, fg.startRule, fg.indexator.literalsEnd, fg.indexator.literalsStart, fg.indexator.termsEnd, fg.indexator.termsStart, fg.indexator.termCount, fg.indexator.nonTermCount, fg.indexator.literalsCount, fg.indexator.eofIndex, fg.rules.rulesCount, fg.indexator.fullCount, acceptEmptyInput, numIsTerminal, numIsNonTerminal, numIsLiteral, fg.canInferEpsilon, slots |> dict)
        parserSource

    let parse grammar graph = buildAbstractAst<Token> grammar graph

    let unpackExtension(ext : int64<extension>) =
        let ``2^32`` = 256L * 256L * 256L * 256L
        (int <| ext / ``2^32``, int <| ext % (``2^32`` * 1L<extension>))

    let getFormalSubgraph (tree : Tree<Token>) : InputGraph =

        let rec f (edges : list<InputEdge>) (count : int ref) (toks : array<Token> ) (current : obj) =
            if current <> null then
                match current with
                | :? TerminalNode as node ->
                    if node.Extension <> packExtension -1 -1
                    then
                        let fst, scnd = unpackExtension((node :> INode).getExtension())
                        let tok = toks.[node.Name]
                        let str = match tok with | Term(st) -> st | EOF -> ""
                        count := !count + 1
                        List.append edges [(fst, scnd, str, true)]
                    else
                        edges
                | :? PackedNode as node ->
                    let l = f edges count toks node.Left
                    let r = f edges count toks node.Right
                    List.append l r
                | :? NonTerminalNode as node ->
                    let fst = f edges count toks node.First
                    let sq = seq {
                        for t in node.Others ->
                            f edges count toks t }
                    List.append fst (List.concat sq)
                | :? IntermidiateNode as node ->
                    let fst = f edges count toks node.First
                    let sq = seq {
                        for t in node.Others ->
                            f edges count toks t }
                    List.append fst (List.concat sq)
                | _ -> edges
            else
                edges
        let mutable count = ref 0
        let edges = f [] count tree.tokens tree.Root

        {
            countOfVertex = !count
            edges = List.toArray edges
        }