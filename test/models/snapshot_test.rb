require 'test_helper'

class SnapshotTest < ActiveSupport::TestCase
  # Add tests here
    def test_summarise_player_times
        Game.create!(id: 1)
        Player.create!(id: 1)
        Player.create!(id: 2)
        @start_time = Time.now-5.minutes
        snapshot(1, "court", @start_time)
        snapshot(2, "bench", @start_time)

        summary = Snapshot.summarise_player_times(1)
        assert_equal({'court'=>0, 'bench' => 0, 'last_position' => 'court'}, summary[1])
        assert_equal({'court'=>0, 'bench' => 0, 'last_position' => 'bench'}, summary[2])

        snapshot(1, "bench", @start_time+3.minutes)
        snapshot(2, "court", @start_time+3.minutes)
        snapshot(1, "bench", @start_time+5.minutes)
        snapshot(2, "bench", @start_time+5.minutes)

        summary = Snapshot.summarise_player_times(1)
        assert_equal(3.minutes, summary[1]['court'])
        assert_equal(2.minutes, summary[2]['court'])
        assert_equal(2.minutes, summary[1]['bench'])
        assert_equal(3.minutes, summary[2]['bench'])
        assert_equal('bench', summary[1]['last_position'])
        assert_equal('bench', summary[1]['last_position'])
    end

    def snapshot(player_id, position, time)
        Snapshot.create!(game_id: 1, player_id: player_id, position: position, game_time: time-@start_time, real_time: time)
    end
end
