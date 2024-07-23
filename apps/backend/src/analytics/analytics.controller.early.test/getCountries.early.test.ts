// Unit tests for: getCountries

import { NotFoundException } from '@nestjs/common';

import { AnalyticsService } from '../analytics.service';

import { PrismaService } from '@reduced.to/prisma';

import { AnalyticsController } from '../analytics.controller';

import { Test, TestingModule } from '@nestjs/testing';

interface MockUserContext {
  id: string;
  // Add other properties as needed
}

class MockAnalyticsService {
  getGroupedByField = jest.fn();
}

class MockPrismaService {
  link = {
    findUnique: jest.fn(),
  };
}

describe('AnalyticsController.getCountries() getCountries method', () => {
  let controller: AnalyticsController;
  let mockAnalyticsService: MockAnalyticsService;
  let mockPrismaService: MockPrismaService;

  const mockUserContext: MockUserContext = {
    id: 'user-id',
  };

  beforeEach(async () => {
    mockAnalyticsService = new MockAnalyticsService();
    mockPrismaService = new MockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  describe('getCountries', () => {
    it('should return grouped data for valid key and days', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockData = { country: 'USA', clicks: 100 };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(mockData as any);

      // Act
      const result = await controller.getCountries(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: mockLink.url, data: mockData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(mockLink.id, 'country', days, undefined);
    });

    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 30;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any);

      // Act & Assert
      await expect(controller.getCountries(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle errors from analytics service gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.getCountries(key, days, mockUserContext as any)).rejects.toThrow('Service error');
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should call getGroupedByField with correct parameters', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockData = { country: 'USA', clicks: 100 };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(mockData as any);

      // Act
      await controller.getCountries(key, days, mockUserContext as any);

      // Assert
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(mockLink.id, 'country', days, undefined);
    });
  });
});

// End of unit tests for: getCountries
