# Instructions for the Study‑App Coding Agent

This document provides high‑level guidance for integrating the curated study resources into your study app. The goal is to use these materials to build a structured learning experience covering calculus, linear algebra, differential equations, classical mechanics, electromagnetism, thermodynamics and quantum mechanics.

## 1. Read the resources list

1. **Parse `study_resources.md`** – The file `study_resources.md` contains a list of recommended resources. Each entry includes a title, a brief description and a link. The agent should read this file and extract, for each entry:
   - `name` – title of the resource
   - `description` – short description of what it covers
   - `link` – URL to the official source
   - `category` – section heading (e.g., Calculus, Linear Algebra, etc.)

2. **Store in an internal database** – Maintain a structured representation (e.g., JSON or database table) with these fields. This allows the app to display resources by category or search them by name.

## 2. Fetch and process content

1. **Download or access resources** – For open textbooks (PDFs) and course pages, fetch the content on demand:
   - For PDFs, download the file and store it locally or in cloud storage.
   - For web courses (MIT OCW, Feynman Lectures), scrape or capture the relevant metadata (syllabus, list of topics, links to lecture notes and videos).

2. **Parse for metadata** – Extract chapter titles, section headings, problem sets, and any available exercises. This will allow the app to organize learning modules.

3. **Respect licenses** – All listed resources are freely accessible, but some (e.g., Feynman Lectures) are for online viewing only. Do not redistribute copyrighted content; instead, link the user to the official site or embed allowed excerpts.

## 3. Build study modules

1. **Module structure** – For each major topic (e.g., derivatives, eigenvalues, first‑order differential equations), create a module containing:
   - A summary of the concept (you can generate concise explanations or pull from open content).
   - Links to the relevant sections in the resource (e.g., a chapter in Strang’s book or a lecture video on MIT OCW).
   - Example problems and exercises with solutions if available.

2. **Progress tracking** – Keep track of which modules the user has completed. Use the agent’s scheduling or reminder functionality (if available) to space out study sessions and reviews.

3. **Updates** – Periodically check if newer versions of these resources are released (e.g., new OCW course iterations). Update the internal database with new links.

## 4. Integration and user interface

1. **Navigation** – Provide a way for the user to browse topics or search for concepts. Use the `category` and `name` fields from the resource list for navigation.

2. **Link handling** – When a user selects a resource, open it in an embedded viewer or external browser. For PDFs, ensure you have a viewer integrated; for web pages, display them inside your app via a web view.

3. **Offline access** – Consider caching downloaded resources for offline use, respecting copyright and license constraints.

## 5. Scheduling and reminders

1. **Learning schedule** – Based on the user’s goal (e.g., learn quantum mechanics within a year), break down the modules into weekly plans.

2. **Notifications** – If the platform allows, schedule reminders (e.g., review a problem set, watch a lecture). This can leverage an automation/reminder system separate from these documents.

## 6. Maintenance and extensibility

1. **Extensible list** – `study_resources.md` can be expanded with additional resources. The agent should handle new entries gracefully.

2. **User feedback** – Provide mechanisms for the user to rate or comment on resources; use this feedback to reorder or highlight popular materials.

3. **Open source vigilance** – Monitor for updates to licenses or availability. If a resource becomes unavailable, flag it and suggest alternatives.

By following these guidelines, the coding agent will be able to transform the curated links into a structured, interactive study plan that supports long‑term learning and skill development.
