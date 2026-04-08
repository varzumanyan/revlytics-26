#!/usr/bin/env python3
"""
Git commit script for accessibility changes
"""
import subprocess
import sys

def run_command(cmd, description):
    """Run a shell command and print the result"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            cwd="/vercel/share/v0-project"
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
        return False

def main():
    print("=== Git Commit and Push Script ===")
    
    # Check current branch
    if not run_command("git branch --show-current", "Checking current branch"):
        print("Failed to check current branch")
        return 1
    
    # Add all changes
    if not run_command("git add -A", "Adding all changes"):
        print("Failed to add changes")
        return 1
    
    # Show status
    run_command("git status --short", "Git status")
    
    # Commit changes
    commit_message = """feat: Implement WCAG 2.1 Level AA accessibility compliance

- Add semantic HTML structure (header, main, nav, footer)
- Implement skip navigation link for keyboard users
- Add ARIA labels and roles to all interactive elements
- Make all charts and tables keyboard accessible with proper ARIA
- Add sortable table headers with keyboard support
- Improve color contrast ratios for text and UI elements
- Add enhanced focus indicators (2px ring with offset)
- Remove auto-opening dialog behavior
- Add screen reader announcements for dynamic content
- Update viewport meta to allow zoom up to 500%
- Add descriptive labels to all buttons and links
- Make all social media links accessible with context
- Add ARIA live regions for loading states

All changes follow WCAG 2.1 Level AA guidelines for government websites."""

    if not run_command(f'git commit -m "{commit_message}"', "Committing changes"):
        print("Failed to commit (maybe no changes?)")
        run_command("git status", "Checking status")
        return 1
    
    # Push to remote
    if not run_command("git push origin HEAD", "Pushing to remote"):
        print("Failed to push changes")
        return 1
    
    print("\n✅ Successfully committed and pushed all accessibility changes!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
