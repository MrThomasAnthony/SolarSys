# Introduction
This project aims to create an interactive simulation of the planets in our solar system using WebGL. The simulation will demonstrate the principles of orbital mechanics and provide a visually engaging and educational experience. Users will gain insight into the relative sizes, distances, and motions of planets within the solar system.

## Objectives
- Develop an interactive 3D simulation of the planets in the solar system.
- Illustrate key principles of orbital mechanics, such as gravity and elliptical orbits.
- Allow users to adjust simulation parameters.
- Provide real-time visualizations of planetary positions and trajectories.
- Enhance the user experience with intuitive controls and interactive elements.

# Technical Approach
- Framework: Use WebGl for 3D rendering and visualization in the browser by rendering multiple spheres to represent the planets in our solar system. In addition, make use of texture mapping for each planet to ensure realism (eg. Earth would be hard to replicated just using color mapping). Make use of Emissive Lighting to replicate the glow effect of the sun and shadowing for demonstration, making the Sun the primary source of light and each planet the object upon which the lighting is reflected on. 
  
- Algorithms: Implement simplified models of planetary motion based on the rotation of each planet and its transformation along its orbital path. Making use of Kepler's laws of planetary motion would be essential for performing transformations on each sphere.

- User Interface: Design an intuitive UI for toggling planetary orbits, pausing/resuming the simulation, focusing on specific planets, zooming in and out and adjusting camera angles.

## Details
### Texture Mapping

- Planets and Sun
Using high-resolution planetary textures from sources like NASA or public texture libraries, I will apply textures to the spheres (e.g., Earth, Moon, Mars) using UV mapping. For the Sun I will make use of a fiery texture to depict the Sun's surface. A nice to have would be animated noise textures to simulate solar flares.

- Implementation
Load textures using WebGL's TEXTURE_2D and map them to sphere geometry. For dynamic effects (e.g., Jupiter's storms), animating textures using time-based offsets would really bring the planet to life. animation on textures will be a tough task so this would be a final modification if there is still time.

### Lighting/Shading
- Point Light for the Sun
Place a point light at the Sun's position to simulate its illumination while using attenuation to model how light diminishes over distance.

- Diffuse using the Phong reflection model.
  - Diffuse: For soft, directional light on the planets.
 
### 3D Modeling/Transformations
To create the celestial bodies, I'll use 3D primitives such as spheres and refine them with shaders.

- Planets and Moons: I will model planets and moons as spheres using subdivided triangles or built-in sphere-generation utilities. Scale each body based on real-world proportions (adjusted for visual clarity).
- Orbital Paths: Use circles to represent orbits. Positions will be computed based on Keplerian motion and/or simplified formulas.
- Sun: The sun will be modeled as a glowing sphere by applying texture mapping for its fiery surface. A nice feature to have will be a vertex displacement shader to simulate solar activity.
- Rings: I will generate multiple small objects like rings efficiently by the use of instancing.


# Timeline

| Objective Number | Objective Description                                     | Status                                  |
|------------------|-----------------------------------------------------------|-----------------------------------------|
| 1                | First Proposal Submission                                 | Deadline: November 04 - Midnight        |
| 2                | 2nd Proposal Submission                                   | Deadline: November 18 - Midnight        |
| 3                | Final Project submission with Presentation                | Deadline: December 09 - 2024 Midnight   |

# Potential Challenges

- Physics Accuracy: Simplifying the complex rotational interactions with respect to the orbital path ensuring the simulation runs efficiently while maintaining realism.
- Performance Optimization: Rendering smooth animations for multiple planets and moons may require optimizations.
- User Interface Design: Balancing functionality and simplicity to provide an intuitive experience.
- Debugging: Identifying and resolving issues in the rendering and motion calculations may be time-intensive.
  
# [DEMO](https://sol.simonmclean.dev/)
