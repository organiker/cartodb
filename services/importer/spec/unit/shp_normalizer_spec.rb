# encoding: utf-8

require 'mocha'
require 'fileutils'
require_relative '../../lib/importer/shp_normalizer'
require_relative '../doubles/job'

include CartoDB::Importer2::Doubles

describe CartoDB::Importer2::ShpNormalizer do

  describe '#shape_encoding' do

    it 'guesses ISO-8859-1 encoding for USA counties common data unzipped' do
      job = CartoDB::Importer2::Doubles::Job.new
      job.stubs(:table_name).returns('county_usa')
      path = File.expand_path(File.join(File.dirname(__FILE__), "../fixtures/county_usa/county_usa.shp"))
      shp_normalizer = CartoDB::Importer2::ShpNormalizer.new(path, job)

      shp_normalizer.shape_encoding.should eq 'WIN1252'
    end
  
  end

end
