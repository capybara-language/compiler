<?php

namespace CapyLexer
{
  abstract class Lexer
  {
    const EOF   = -1;
    const T_EOF = "T_EOF";

    protected $input;
    protected $position = 0;
    protected $char;

    public function __construct($input)
    {
      $this->input = $input;
      $this->char = $input[$this->position];
    }

    public function next($plus = 1)
    {
      return $this->input[$this->position + $plus];
    }

    public function matchNext($value)
    {
      for ($i = 0, $l = strlen($value); $i < $l; $i++) {
        if ($this->next($i) !== $value[$i]) {
          return false;
        }
      }
      return true;
    }

    public function consume($next = 1)
    {
      $this->position += $next;
      if ($this->position >= strlen($this->input)) {
        $this->char = self::EOF;
      } else {
        $this->char = $this->input[$this->position];
      }
    }

    public abstract function nextToken();
  }
}