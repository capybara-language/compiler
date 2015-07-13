<?php

namespace CapyParser
{
  abstract class Parser
  {
    public $input;
    public $lookahead;

    public function __construct(\CapyLexer\Lexer $lexer)
    {
      $this->input = $lexer;
      $this->consume();
    }

    public function match($token)
    {
      if ($this->lookahead->name === $with) {
        $this->consume();
      } else {
        throw new \Exception("Expecting token " . $with . ". Found " .
          $this->lookahead . " {$this->lookahead->value}");
        exit;
      }
    }

    public function consume()
    {
      $this->lookahead = $this->input->nextToken();
    }
  }
}