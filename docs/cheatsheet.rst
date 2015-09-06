==================
Shpinx cheat sheet
==================

emphasis
--------

*text*
:emphasis:`text`

literal
-------

``text \ and \ backslashes``
:literal:`text \ and \ backslashes`

code
-------
.. role:: latex(code)
   :language: latex

codepart
---------
python ::
    
    def foo(a):
        def bar(b): 
            b += a
        return bar


math
----
The area of a circle is :math:`A_\text{c} = (\pi/4) d^2`.

pep-reference
-------------
ee :PEP:`287` for more information about reStructuredText.

See `PEP 287`__ for more information about reStructuredText.

__ http://www.python.org/peps/pep-0287.html


strong
-------
**text**
:strong:`text`


subscript and  superscript
----------------------------
H\ :sub:`2`\ O
E = mc\ :sup:`2`

The chemical formula for pure water is |H2O|.

.. |H2O| replace:: H\ :sub:`2`\ O


title-reference
----------------

`Design Patterns` [GoF95]_ is an excellent read.

list
-----
* asdf
* asdf

  * asdf
  * asdf


term
----
term (up to a line of text)
   Definition of the term, which must be indented

      and can even consist of multiple paragraphs

next term
    Description.
