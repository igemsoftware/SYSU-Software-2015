===========================================
``CORE.routes.design`` -- Design routes 
===========================================

.. currentmodule:: server.models

``CORE.routes.design`` is the route for the design part. 
Prefix is ``/design``.

``/design/data/fetch/parts``
-----------------------------
:Usage: Get all parts information.
:Output: A list of parts.
:Output Example: 

.. code-block:: json

    {
      "parts": [
        {
          "BBa": "BBa_B0032",
          "attr": "RBS:BBa_B0032",
          "bacterium": "\r",
          "introduction": "No introduction yet.",
          "name": "RBS",
          "risk": -1,
          "source": "Come from no where.",
          "type": "RBS"
        },
        {
          "BBa": "",
          "attr": "OHHL",
          "bacterium": "\r",
          "introduction": "No introduction yet.",
          "name": "OHHL",
          "risk": -1,
          "source": "Come from no where.",
          "type": "chemical"
        }]
    }


``/design/data/fetch/parts``
-----------------------------
:Usage: Get all relationship information.
:Output: A list of relationship.
:Output Example: 

.. code-block:: json

    {
      "relationship": [
        {
          "end": "gfp:BBa_E0040",
          "equation": {
            "content": "\\frac{ d([Pcl]) }{ dt } = {{alpha}} * [Pcl] + {{beta}}",
            "parameters": {
              "alpha": 0.1,
              "beta": "K_1"
            }
          },
          "start": "Ptet:BBa_R0040",
          "type": "normal\r"
        },
        {
          "end": "Ptet:BBa_R0040",
          "equation": {
            "content": "",
            "parameters": {}
          },
          "start": "gfp:BBa_E0040",
          "type": "normal\r"
        },
    }


``/design/data/fetch/adjmatrix``
--------------------------------
:Usage: Get adjacent matrix of all components.
:Output: An adjacent matrix.
:Output Example: 

.. code-block:: json

    {
     "adjmatrix": {
        "2UVRB-TetRDBD": [
          "UVR8-TetRDBD(dimer)",
          "PABA"
        ],
        "3OC12HSL": [
          "LasI",
          "Ptet"
        ],
        "A-RBS": [
          "Pcon",
          "cI",
          "luxI"
        ]
    }


``/design/data/fetch/device``
--------------------------------
:Usage: Get all devices. 
:Output: A list of devices.
:Output Example: 

.. code-block:: json

    {
        "deviceList": [
        {
          "interfaceA": "Fusaric Acid_1",
          "interfaceB": "FadP_1",
          "introduction": "protects banana plants from Fusarium oxysporum. The Banana Guard system senses fusaric acid and, in response, produces fungal growth inhibitors to prevent infection of the banana plant. In addition we have also implemented a Kill-switch that disables our system when fusaric acid is not present. For this, we have optimized the circuit design, assessed the potential of BananaGuard in the soil, and analyzed the robustness of the system using different mathematical models.",
          "parts": [
            {
              "partID": "Fusaric Acid_1",
              "partName": "Fusaric Acid",
              "positionX": 300.0,
              "positionY": 300.0
            },
            {
              "partID": "FadP_1",
              "partName": "FadP",
              "positionX": 300.0,
              "positionY": 300.0
            },
            {
              "partID": "fadP_1",
              "partName": "fadP",
              "positionX": 300.0,
              "positionY": 300.0
            }
          ],
          "relationship": [
            {
              "end": "FadP_1",
              "start": "Fusaric Acid_1",
              "type": "inhibition\r"
            },
            {
              "end": "FadP_1",
              "start": "fadP_1",
              "type": "promotion\r"
            }
          ],
          "risk": -1,
          "source": "http://2014.igem.org/Team:Wageningen_UR/project/fungal_sensing",
          "title": "Sensor"
        }]
    }



``/design/circuit/<int:id>``
--------------------------------
:Method: POST
:Usage: Update a circuit. 
:Input: A json object of circuit.
:Input Example: The same as an item of the output of `/design/data/fetch/device`_
