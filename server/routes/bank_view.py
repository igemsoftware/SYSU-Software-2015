# -*- coding: utf-8 -*-

from . import bank
from ..models import Design, User, EquationBase, DesignComment
from .. import login_manager, db
from ..tools.shorten import shorten
from modeling_view import get_system_from_design

from flask import render_template, jsonify, request, \
        current_app, url_for, redirect, abort
from flask.ext.login import login_required, current_user
from sqlalchemy import or_
from datetime import datetime

@bank.route('/')
def index():
    """
        :Usage: "The index of the CORE-Bank. There are two list.
    """
    return render_template('bank.html')

@bank.route('/list')
def get_list():
    """
        :Usage: Get a list of :class:`Design` . 
        :Output: A list of :class:`Design` . 
        :Argument:

        * per_page: How many tasks per page. (default=7)
        * page: Which page you want to get. (default=1) 
        * keyword: Sort by :attr:`Design.id`, :attr:`Design.used``, :attr:`Design.rate`, or :attr:`Design.last_active` . (default= :attr:`Design.id`)
        * mode: ``share`` or ``public`` (default=``public``)

        :Output Example: 

        .. code-block:: json

            {
              "designs": [
                {
                  "comments": 0,
                  "contributor": "test",
                  "description": "First design",
                  "id": 1,
                  "last active": "2015-09-10 19:46:58",
                  "name": "My first design",
                  "rate": 0
                },
                {
                  "comments": 0,
                  "contributor": "test",
                  "description": "Second design",
                  "id": 2,
                  "last active": "2015-09-10 19:46:58",
                  "name": "My second design",
                  "rate": 0
                }] 
            }
    """

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page',
            current_app.config['FLASKY_DESIGNS_PER_PAGE'], type=int)
    order = request.args.get('order', 'id', type=str)
    keyword = request.args.get('keyword', '', type=str)
    mode = request.args.get('mode', 'public', type=str)

    order_obj = {
                 'id': Design.id.asc(),
                 'used': Design.used.desc(),
                 'rate': Design.rate.desc(),
                 'last-active': Design.last_active.desc(),
                }

    if mode == "share":
        if current_user.is_anonymous():
            """ authentic check """
            return jsonify(error=1, aux=url_for(login_manager.login_view, next=url_for('bank.index')) )
        query_obj = Design.query.filter(Design.is_shared==True)
    else:
        query_obj = Design.query.filter(Design.is_public==True)

    all_list = query_obj.\
            filter(or_(Design.name.like('%'+keyword+'%'),\
                       Design.brief_description.like('%'+keyword+'%'))\
                  ).\
            order_by(order_obj.get(order, Design.id.asc()))
    pagination = all_list.paginate(page, per_page=per_page, error_out=False)

    l = []
    for d in pagination.items:
        l.append({'id': d.id,
                  'name': '<a href="%s">%s</a>' % (url_for('bank.get_detailed', id=d.id), d.name), 
                  'description': shorten(d.brief_description, 30),
                  'contributor': d.owner.username,
                  'rate': '%g' % d.rate,
                  'comments': d.comments.count(),
                  'last active': d.last_active.strftime('%Y-%m-%d %H:%M:%S'),
                  'used': d.used,
                 })

    return jsonify(designs=l, count=all_list.count())

@bank.route('/share', methods=["POST"])
@login_required
def share_design():
    """
        :Note: Login required
        :Usage: Share a finished but not shared design from your repo.
        :Input: A list of :class:`Design` . 
        
        :Input Example: 

        .. code-block:: json

            {
                "Design": 1,
                "brief_description": "toggle switch",
                "full_description": "blablabla..."
            }
    """
    id = request.form.get('Design', -1)
    d = Design.query.get(id)
    if not d or d.owner != current_user: 
        return redirect(url_for('bank.index'))#jsonify(msg='false')

    d.is_shared = True
    d.release_time = datetime.now()
    d.full_description = request.form.get('full_description', '')
    d.brief_description = request.form.get('brief_description', '')
    d.last_active = datetime.now()
    d.check_public()
    db.session.add(d)
    db.session.commit()

    return redirect(url_for('bank.index'))

@bank.route('/finishedList/')
@login_required
def get_finished_list(): 
    """
        :Note: Login required
        :Usage: Get the list of finished but not shared designs. 
        :Input: A list of :class:`Design` . 
        
        :Output Example: 

        .. code-block:: json

            {"finishedList": 
                [{
                    "id": 1,
                    "name":"toggle switch"
                },
                {
                    "id": 13,
                    "name":"GFP"
                }]
            } 
    """
    l = []
    for d in current_user.designs.filter_by(is_shared=False).all():
        l.append({'id':d.id, 'name': d.name})
    return jsonify(finishedList = l)


@bank.route('/detail/<int:id>')
#@login_required
def get_detailed(id): 
    """
        :Note: Login required
        :Usage: Get details of a :class:`design`
        
        :Output Example: 

        .. code-block:: json

            {
              "design": {
                "comments": 0,
                "favoriter": 0,
                "id": 1,
                "name": "My first design",
                "owner": "test",
                "release_time": "2015-09-15 00:44:27"
              }
            }
    """


    d = Design.query.get(id)
    if not d: abort(404)#return jsonify(error='This design doesn\'t exist')
    system, var_mapper = get_system_from_design(id)

    print 'here'
    print system

    return render_template('bank_detail.html', design=d, system=system)


@bank.route('/datail/comment/<int:id>', methods=["POST"])
@login_required
def comment_detail(id): 
    """
        :Note: Login required
        :Usage: Comment on a design 
        
        :Output Example: 

        .. code-block:: json

            {
              "content": "Good design!"
            }
    """

    d = Design.query.get(id)
    if not d: 
        abort(404) #return jsonify(error='This design doesn\'t exist')
    
    db.session.add(
            DesignComment(
                content = request.form.get('content', ''),
                owner = current_user,
                design = d
                )
            )
    db.session.commit()


#   design = {
#               'name': d.name,
#               'id': d.id,
#               'favoriter': len(d.favoriter),
#               'comments': d.comments.count(),
#               'owner': d.owner.username,
#               'release_time': d.release_time.strftime('%Y-%m-%d %H:%M:%S')
#             }
#   
    return redirect(url_for('bank.get_detailed', id=id, _anchor='UserReviews'))


@bank.route('/datail/favorites/add/<int:id>')
@login_required
def favorites_add(id): 
    """
        :Note: Login required
        :Usage: Collect a design into favorites 
    """

    d = Design.query.get(id)
    if not d: 
        abort(404) #return jsonify(error='This design doesn\'t exist')

    current_user.favorite_designs.append(d)
    db.session.add(current_user)
    
    return redirect(url_for('bank.get_detailed', id=d.id))

@bank.route('/datail/favorites/del/<int:id>')
@login_required
def favorites_del(id): 
    """
        :Note: Login required
        :Usage: Remove a design from favorites 
    """

    d = Design.query.get(id)
    if not d: 
        abort(404) #return jsonify(error='This design doesn\'t exist')

    if d in current_user.favorite_designs:
        current_user.favorite_designs.remove(d)
    db.session.add(current_user)
    
    return redirect(url_for('bank.get_detailed', id=d.id))

