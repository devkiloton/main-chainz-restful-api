import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getConfigDataSource } from './get-config-data-source';

const dataSourceOptions: DataSourceOptions = getConfigDataSource();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
