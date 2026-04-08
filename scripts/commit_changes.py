#!/usr/bin/env python3
"""
Commit and push accessibility changes to GitHub
"""
import subprocess
import sys
import os

def run_command(cmd, cwd=None):
    """Run a shell command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}", file=sys.stderr)
        print(f"Error: {e.stderr}", file=sys.stderr)
        sys.exit(1)

def main():
    # Project directory
    project_dir = "/vercel/share/v0-project"
    
    print("Checking git status...")
    run_command("git status", cwd=project_dir)
    
    print("\nAdding all changes...")
    run_command("git add -A", cwd=project_dir)
    
    print("\nCommitting changes...")
    commit_message = """feat: Implement WCAG 2.1 Level AA compliance

- Add semantic HTML structure with proper landmarks (header, main, nav, footer)
- Implement skip navigation link for keyboard users
- Add comprehensive ARIA labels and roles to all interactive elements
- Enhance focus indicators meeting 3:1 contrast requirements
- Make all charts and data visualizations accessible with ARIA labels
- Add keyboard navigation support to sortable table headers
- Improve color contrast ratios for text and UI elements
- Add screen reader support with live regions for dynamic content
- Remove auto-opening dialog behavior (WCAG 2.2.2)
- Add proper ARIA labels to all form controls and buttons
- Ensure all functionality is keyboard accessible
- Update viewport meta tag to allow user scaling up to 500%

This comprehensive update ensures the dashboard is fully accessible
to users with disabilities, meeting ADA compliance requirements."""
    
    run_command(f'git commit -m "{commit_message}"', cwd=project_dir)
    
    print("\nPushing to GitHub...")
    run_command("git push origin HEAD", cwd=project_dir)
    
    print("\n✅ Successfully committed and pushed accessibility improvements!")

if __name__ == "__main__":
    main()
