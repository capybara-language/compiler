require! {
  readline
  colors
}

say = (|> console.log)
not-empty = (.trim!length isnt 0)
is-internal-command = (.0 is ":")
reset-prompt = (rl) ->
  rl.set-prompt ("capy> " |> colors.cyan), 6
  rl.prompt yes

function autocompleter line
  completions = <[ Module SubModule Declare Do When Stop Export Import Block
    Integer String Any Bool Yes No ]>
  hits = completions.filter (c) -> (c.index-of line) is 0
  [if hits.length then hits else completions, line]

rl = readline.create-interface do
  input: process.stdin
  output: process.stdout
  terminal: yes
  completer: autocompleter

reset-prompt rl
rl.on \SIGINT ->
  rl.question "Quit Capybara REPL? (Y/n)" (answer) ->
    if answer.match /^y(es)?$/i or answer.trim! is ""
      rl.pause!
    else
      reset-prompt rl
rl.on \line (line) ->
  if not-empty line
    if is-internal-command line
      switch line.slice 1
      | \clear => console.log "LIMPO"
    else
      console.log line
  reset-prompt rl
