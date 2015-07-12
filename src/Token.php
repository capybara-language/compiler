<?php

namespace CapyLexer
{
  class Token
  {
    private $key;
    private $value;

    public function __construct($key, $value = null)
    {
      list ($this->key, $this->value) = [$key, $value];
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
        . "]";
    }
  }
}