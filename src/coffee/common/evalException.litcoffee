    ((factory) ->
      if typeof define is "function" and define.amd
        define([], factory)
      else
        module.exports = factory()
    )(() ->

      # EvalException is thrown during evaluation.
      # For example Dividing by zero errors.
      EvalException = (msg, node) ->
        if not msg
          throw new Error("msg is null")
        @message = msg
        @node = node
        @isEvalException = true
        return @

      EvalException.prototype.toString = () -> return this.message

      
      return EvalException
    )