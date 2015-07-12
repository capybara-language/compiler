<?php

namespace CapyLexer
{
  class Token
  {
    private $key;
    private $value;
    private $local = [
      "line"   => "??"
    , "column" => "??"
    ];

    public function __construct($key, $value = null, $local = null)
    {
      $this->key = $key;
      if (is_array($value)) {
        $this->local = $value ?: $this->local;
      } else {
        $this->value = $value;
        $this->local = $local ?: $this->local;
      }
    }

    public function getKey()
    {
      return $this->key;
    }

    public function getValue()
    {
      return $this->value;
    }

    public function __toString()
    {
      return "[" . TokenList::getTokenName($this->key)
        . (isset($this->value) ? ", \"{$this->value}\"" : "")
        . ", " . $this->local['line'] . ", " . $this->local['column'] . "]\n";
    }
  }
}