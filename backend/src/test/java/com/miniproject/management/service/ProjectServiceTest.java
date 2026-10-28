package com.miniproject.management.service;

import com.miniproject.management.dto.ProjectRequest;
import com.miniproject.management.entity.Project;
import com.miniproject.management.entity.ProjectStatus;
import com.miniproject.management.exception.BadRequestException;
import com.miniproject.management.exception.ResourceNotFoundException;
import com.miniproject.management.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project sampleProject;
    private ProjectRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleProject = new Project(
                1L,
                "Library Management System",
                "A system for managing books and student borrowings.",
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 12, 1),
                ProjectStatus.NOT_STARTED
        );

        sampleRequest = new ProjectRequest(
                "Library Management System",
                "A system for managing books and student borrowings.",
                LocalDate.of(2026, 11, 1),
                LocalDate.of(2026, 12, 1),
                ProjectStatus.NOT_STARTED
        );
    }

    @Test
    void testCreateProjectSuccess() {
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        Project created = projectService.createProject(sampleRequest);

        assertNotNull(created);
        assertEquals("Library Management System", created.getName());
        assertEquals(ProjectStatus.NOT_STARTED, created.getStatus());
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void testCreateProjectDeadlineBeforeStartDateThrowsBadRequest() {
        sampleRequest.setStartDate(LocalDate.of(2026, 12, 10));
        sampleRequest.setDeadline(LocalDate.of(2026, 12, 1));

        BadRequestException exception = assertThrows(BadRequestException.class, () -> {
            projectService.createProject(sampleRequest);
        });

        assertEquals("Deadline cannot be earlier than start date.", exception.getMessage());
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void testGetAllProjects() {
        when(projectRepository.findAll()).thenReturn(Arrays.asList(sampleProject));

        List<Project> list = projectService.getAllProjects();

        assertEquals(1, list.size());
        assertEquals("Library Management System", list.get(0).getName());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testGetProjectByIdSuccess() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        Project found = projectService.getProjectById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void testGetProjectByIdNotFoundThrowsResourceNotFound() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById(999L);
        });

        assertTrue(exception.getMessage().contains("Project not found with id: 999"));
    }

    @Test
    void testUpdateProjectSuccess() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        sampleRequest.setStatus(ProjectStatus.IN_PROGRESS);
        Project updated = projectService.updateProject(1L, sampleRequest);

        assertNotNull(updated);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void testDeleteProjectSuccess() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        doNothing().when(projectRepository).delete(sampleProject);

        projectService.deleteProject(1L);

        verify(projectRepository, times(1)).delete(sampleProject);
    }
}
