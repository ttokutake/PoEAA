# frozen_string_literal: true

class SomeClass
  def initialize
    puts "an instance was created in #{Thread.current}!"
  end
end

class Registry
  def self.instance
    Thread.current[:instance] ||= SomeClass.new
    puts "an instance was called in #{Thread.current}!"
    Thread.current[:instance]
  end
end

(1..5).map do
  Thread.start do
    Registry.instance
    Registry.instance
  end
end.each(&:join)
