# -*- coding: utf-8 -*-
import importlib
import os.path
from docutils import nodes
from docutils.statemachine import ViewList
from docutils.parsers.rst import directives, Directive

from sphinx import addnodes
from sphinx.roles import XRefRole
from sphinx.locale import l_
from sphinx.domains import Domain, ObjType
from sphinx.directives import ObjectDescription
from sphinx.util import force_decode
from sphinx.util.docstrings import prepare_docstring
from sphinx.util.nodes import make_refnode, nested_parse_with_titles
from sphinx.util.docfields import Field, TypedField, GroupedField


class FlaskRoute(ObjectDescription):
    option_spec = {
        'noindex': directives.flag,
        'methods': directives.unchanged_required,
        'endpoint': directives.unchanged_required,
        'short_desc': directives.unchanged,
    }

    doc_field_types = [
        TypedField('path_argument', label=l_('Path Args'),
                   names=('parg', 'path_argument'),
                   typenames=('type', ), can_collapse=False),
        TypedField('qs_argument', label=l_('Query String'),
                   names=('qsarg', 'qarg', 'qs_arg'),
                   typenames=('type', ), can_collapse=False),
        TypedField('form_argument', label=l_('Form Args'),
                   names=('formarg', 'form_arg', 'farg'),
                   typenames=('type', ), can_collapse=False),
        TypedField('template_argument', label=l_('Template Args'),
                   names=('targ', 'tplarg'), can_collapse=False),
        GroupedField('status_code', label=l_('Status Codes'),
                     names=('status_code', 'status'),
                     can_collapse=False),
        Field('response', label=l_('Response'), has_arg=False,
              names=('response', 'resp')),
        Field('template', label=l_('Template'), has_arg=False,
              names=('template', 'tpl')),
    ]

    def handle_signature(self, sig, signode):
        endpoint = self.options.get('endpoint')
        signode += addnodes.desc_annotation(l_('Route '), l_('Route '))
        signode += addnodes.desc_name(sig, sig)
        return endpoint

    def add_target_and_index(self, name, sig, signode):
        target_name = 'flask.route.' + name
        if target_name not in self.state.document.ids:
            signode['names'].append(target_name)
            signode['ids'].append(target_name)
            signode['first'] = (not self.names)
            self.state.document.note_explicit_target(signode)
            inv = self.env.domaindata['flask']['routes']
            if name in inv:
                self.state_machine.reporter.warning(
                    'duplicate Flask route description of %s, '
                    'other instance in %s'
                    % (name, self.env.doc2path(inv[name])),
                    line=self.lineno)
            inv[name] = self.env.docname, sig

        index_text = '%s (Flask route %s)' % (name, sig)
        self.indexnode['entries'].append(('single', index_text,
                                          target_name, ''))

    def run(self):
        indexnode, node = super(FlaskRoute, self).run()
        content_node = node[-1]
        methods = [m.strip() for m in self.options.get('methods').split(',')]
        endpoint = self.options.get('endpoint')

        route_info_node = nodes.field_list()

        _methods_container = nodes.container()
        for m in methods:
            _methods_container.append(nodes.literal(m, m))
            _methods_container.append(nodes.inline(' ', ' '))

        methods_node = nodes.field()
        body_node = nodes.field_body()
        methods_node.append(nodes.field_name(l_('Methods'), 'Methods'))
        body_node.append(_methods_container)
        methods_node.append(body_node)
        route_info_node.append(methods_node)

        endpoint_node = nodes.field()
        endpoint_node.append(nodes.field_name(l_('Endpoint'), 'Endpoint'))
        body_node = nodes.field_body()
        body_node.append(nodes.literal(endpoint, endpoint))
        endpoint_node.append(body_node)
        route_info_node.append(endpoint_node)

        content_node.insert(0, route_info_node)

        return [indexnode, node]


class FlaskRouteXRefRole(XRefRole):
    def process_link(self, env, refnode, has_explicit_title, title,
                     target):
        if not has_explicit_title:
            target_obj = env.domaindata['flask']['routes'].get(target, None)
            if target_obj is not None:
                return target_obj[1], target
        return title, target


class FlaskDomain(Domain):
    name = 'flask'
    label = 'Flask'
    object_types = {
        'route': ObjType(l_('route'), 'route')
    }
    directives = {
        'route': FlaskRoute
    }
    roles = {
        'route': FlaskRouteXRefRole()
    }
    initial_data = {
        'routes': {}
    }

    def clear_doc(self, docname):
        for name, (_docname, _) in self.data['routes'].items():
            if docname == _docname:
                del self.data['routes'][name]

    def resolve_xref(self, env, fromdocname, builder,
                     typ, target, node, contnode):
        target_obj = self.data['routes'].get(target, None)
        if target_obj is None:
            return None
        return make_refnode(builder, fromdocname,
                            target_obj[0], 'flask.route.' + target, contnode,
                            target_obj[1])

    def get_objects(self):
        for name, (docname, url) in self.data['routes'].iteritems():
            yield name, url, 'route', docname, 'flask.route.' + name, 1


class AutoFlaskRoutes(Directive):
    has_content = False
    required_arguments = 1

    _ignored_endpoints = {'static'}

    def _add_line(self, line):
        self.result.append(line, '')

    def _generate_route_doc(self, url, endpoint, methods, viewfunc):
        self._add_line('.. flask:route:: ' + url)
        self._add_line('   :methods: ' + ','.join(methods))
        self._add_line('   :endpoint: ' + endpoint)
        self._add_line('')

        docstring = viewfunc.func_doc
        if isinstance(docstring, unicode):
            docs = prepare_docstring(docstring, 1)
        elif isinstance(docstring, str):
            docs = prepare_docstring(force_decode(docstring, None), 1)
        for line in docs:
            self._add_line('   ' + line)

    def _add_function_dependency(self, func):
        if hasattr(func, '__module__'):
            module = importlib.import_module(func.__module__)
            filename = module.__file__
            if filename.endswith('.pyc'):
                _filename = filename[:-1]
                if os.path.exists(_filename):
                    filename = _filename
            if os.path.exists(filename):
                self.state.document.settings.record_dependencies.add(filename)

    def run(self):
        app_obj_name = self.arguments[0]
        module_name, app_obj_name = app_obj_name.rsplit('.', 1)
        app_obj = getattr(importlib.import_module(module_name), app_obj_name)

        route_list = []
        for rule in app_obj.url_map.iter_rules():
            if rule.endpoint in self._ignored_endpoints:
                continue
            func = app_obj.view_functions[rule.endpoint]
            route_list.append((rule.rule, rule.endpoint, rule.methods, func))
            self._add_function_dependency(func)
        route_list.sort(key=lambda x: x[0])

        self.result = ViewList()
        dir_name = None
        for route_info in route_list:
            _dir_name = route_info[0].split('/', 2)[1]
            if _dir_name != dir_name:
                dir_name = _dir_name
                title = '%s ``/%s``' % (l_('Routes under'), dir_name)
                self._add_line(title)
                self._add_line('^' * len(title))
            self._generate_route_doc(*route_info)

        _tmp_node = nodes.section()
        nested_parse_with_titles(self.state, self.result, _tmp_node)
        return _tmp_node.children


def setup(app):
    app.add_directive('autoflaskroutes', AutoFlaskRoutes)
    app.add_domain(FlaskDomain)
