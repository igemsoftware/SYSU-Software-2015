# -*- coding: utf-8 -*-

from . import protocol 
from .. import db
from ..models import Protocol, Design 
from flask import jsonify, json, request
from flask.ext.login import login_required

@protocol.route('/setB')
def all_protocols():
    """
        :Usage: Get the setB of protocols. 
        :Output: A list of setB protocols.
        :Example Output:

        .. code-block:: json

            {
              "protocols": [
              {
                  "component": [
                    "NaCl;",
                    "Bacto\u00e2\u0084\u00a2 tryptone;",
                    "yeast extract;",
                    "ddH2O;",
                    "5 M NaOH."
                  ],
                  "id": 18,
                  "introduction": "Lysogeny broth (LB) is one of the rich media for bacterial growth and is the standard choice for E. coli. LB was developed by G. Bertani and later optimized by Luria during the 1950s. It subsequently acquired different names, including Luria broth, Luria\u00e2\u0080\u0093Bertani media and Lennox broth, some containing different salt concentrations.",
                  "likes": 0,
                  "name": "B1-6 LB Medium",
                  "procedure": [
                    {
                      "annotation": "Tryptone and yeast extract are nutrients for bacterial culture media. NaCl provides sodium ions.",
                      "procedure": "0.5% (w/v) yeast extract.",
                      "time": "5min"
                    },
                    {
                      "annotation": "",
                      "procedure": "2. Add ddH2O up to 600 mL.",
                      "time": "45s"
                    },
                    {
                      "annotation": "pH should be adjusted to an appropriate range for bacteria growth or metabolite accumulation.",
                      "procedure": "3. 100 \u00ce\u00bcL of 5 M NaOH (adjusts the pH to ~7.0).",
                      "time": "2min"
                    },
                    {
                      "annotation": "Autoclaving in time prevents contaminative growth.",
                      "procedure": "4. Autoclave for 20 min within 2 hr.",
                      "time": "20min"
                    }
                  ],
                  "setB": true
                }]
            }
         

    """

    protocols = map(lambda x: x.jsonify(), Protocol.query.filter_by(recommend=True, setB=True).all())
    return jsonify(protocols=protocols)

@protocol.route('/design/<int:id>', methods=['GET'])
@login_required
def get_design_s_protocols(id): 
    """
    :Method: GET
    :Usage: Get the protocols of a circuit. 
    :Output: A list of protocols.
    :Example Output:

    .. _protocol-example:

    .. code-block:: json

        {
          "protocols": [
            {
              "component": [
                ""
              ],
              "id": 1,
              "introduction": "",
              "likes": 0,
              "name": "2-2-3 Ligation",
              "procedure": [
                {
                  "annotation": "",
                  "procedure": "1. Add 2 \u00ce\u00bcL (20 ng) of each of the three digestion mixtures to 11 \u00ce\u00bcL of water.",
                  "time": "5min/tube"
                },
                {
                  "annotation": "Buffer provides appropriate condition for ligase to work.",
                  "procedure": "2. Add 2 \u00ce\u00bcL 10x reaction buffer for T4 DNA ligase.",
                  "time": "15s/tube"
                },
                {
                  "annotation": "Ligase is commonly used to join together DNA fragments.",
                  "procedure": "3. Add 1 \u00ce\u00bcL of T4 DNA ligase to give a final volume of 20 \u00ce\u00bcL.",
                  "time": "15s/tube"
                },
                {
                  "annotation": "",
                  "procedure": "4. Incubate at room temperature (~22\u00c2\u00b0C) for 30 min.",
                  "time": "30min"
                },
                {
                  "annotation": "",
                  "procedure": "5. Heat-inactivate the enzymes by heating at 80\u00c2\u00b0C for 20 min.",
                  "time": "20min"
                }
              ],
              "setB": false
            }
          ]
        }



    """
    # skip: check whether current user has the privilege 
    c = Design.query.get(id)
    if not c: abort(404)

    return jsonify(protocols = json.loads(c.protocols))


@protocol.route('/design/<int:id>', methods=['POST'])
@login_required
def set_design_s_protocols(id): 
    """
        :Method: POST
        :Usage: Update the protocol of a circuit. 
        :Input: A list of protocols.
        :Input Examples: See `protocol-example`_


    """
#    require checking current user
#    if request.headers['Content-Type'] == 'application/json':
    protocols = request.get_json(force=True)

    c = Design.query.get(id)
    if not c: abort(404)

    for ind, p in enumerate(protocols):
        p['id'] = ind+1
    c.protocols = json.dumps(protocols)
    db.session.add(c)

    return 'Success' 
