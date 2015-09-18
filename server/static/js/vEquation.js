var vEquation = Vue.component('v-equation', {
    template: '#equation-template',
    props   : ['expression', 'target'],
    data : function() { return {
        expression : '',
        target : '',
        latexExp : ''
    }},
    computed : {
        mathJSExp : function() {
          return this.expression.replace(/[{}]/g, '')
                                .replace(/\*\*/g, '^');
        },
    },
    ready : function() {
        this.latexExp = math.parse(this.mathJSExp).toTex({parentheses: 'auto'});
        this.$watch('mathJSExp', function() {
          this.latexExp = math.parse(this.mathJSExp).toTex({parentheses: 'auto'});
        });
        this.$watch('latexExp', function() {
          MathJax.Hub.Queue(["Typeset",MathJax.Hub,"output"]);
        });
    }
});
