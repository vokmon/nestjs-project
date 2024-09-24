import { DatasourceService } from '@src/datasource/datasource.service';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
  mockReset(datasourceMockService);
});

const datasourceMockService = mockDeep<DatasourceService>();
export default datasourceMockService;
