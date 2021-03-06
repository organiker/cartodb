# encoding: utf-8
require_relative './stats'
require_relative './support_tables'

module CartoDB
  module Visualization
    class Relator
      LAYER_SCOPES  = {
                        base:             :user_layers,
                        cartodb:          :data_layers,
                        carto_and_torque: :carto_and_torque_layers,
                        others:           :other_layers
                      }

      INTERFACE     = %w{ overlays map user table related_tables layers stats single_data_layer? synchronization
                          permission support_tables likes reload_likes }

      def initialize(attributes={})
        @id             = attributes.fetch(:id)
        @map_id         = attributes.fetch(:map_id)
        @user_id        = attributes.fetch(:user_id)
        @permission_id  = attributes.fetch(:permission_id)
        @kind           = attributes.fetch(:kind)
        @support_tables = nil
        @likes          = nil
      end

      def support_tables
        @support_tables ||= Visualization::SupportTables.new(user.in_database,
                                     { parent_id: @id, parent_kind: @kind, public_user_roles: user.public_user_roles})
      end

      def overlays
        @overlays ||= Overlay::Collection.new(visualization_id: id).fetch
      end

      def map
        @map ||= ::Map.where(id: map_id).first
      end

      def user
        @user ||= User.where(id: @user_id).first unless @user_id.nil?
      end

      def table
        return nil unless defined?(::Table)
        @table ||= ::Table.where(map_id: map_id).first 
      end

      def related_tables
        @related_tables ||= layers(:carto_and_torque)
          .flat_map(&:affected_tables).uniq
      end

      def layers(kind)
        return [] unless map
        map.send(LAYER_SCOPES.fetch(kind))
      end

      def synchronization
        return {} unless table
        table.synchronization
      end

      def stats(user=nil)
        @stats ||= Visualization::Stats.new(self, user).to_poro
      end

      def single_data_layer?
        layers(:cartodb).to_a.length == 1 || related_tables.length == 1
      end

      def permission
        @permission ||= CartoDB::Permission.where(id: @permission_id).first unless @permission_id.nil?
      end

      def likes
        @likes ||= Like.where(subject: @id).all.to_a
      end

      def reload_likes
        @likes = nil
        likes
      end

      attr_reader :id, :map_id
    end
  end
end

