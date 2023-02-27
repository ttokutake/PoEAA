# frozen_string_literal: true

class Singleton
  @mutex = Mutex.new
  @count = 0

  def self.puts_and_increment_without_mutex
    puts(@count)
    @count += 1
  end

  def self.puts_and_increment_with_mutex
    @mutex.synchronize do
      puts(@count)
      @count += 1
    end
  end
end

puts('--- without Mutex ---')

(1..5).map do
  Thread.start do
    Singleton.puts_and_increment_without_mutex
  end
end.each(&:join)

puts('--- with Mutex ---')

(1..5).map do
  Thread.start do
    Singleton.puts_and_increment_with_mutex
  end
end.each(&:join)
